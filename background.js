let selectedExam = "JEE"; // Default exam, updated via message
let filteringMode = "strict"; // strict, moderate, relaxed
let distractingSites = new Set();
let allowedKeywords = new Map();

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['groqApiKey'], (result) => {
      const apiKey = result.groqApiKey;
      if (!apiKey) {
        console.warn('⚠️ No Groq API key configured. Please set your API key in the extension settings.');
        resolve(null);
      } else {
        resolve(apiKey);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "setExam") {
    selectedExam = message.exam;
    sendResponse({ status: "ok" });
  } else if (message.type === "setApiKey") {
    chrome.storage.local.set({ groqApiKey: message.apiKey }, () => {
      sendResponse({ status: "ok" });
    });
    return true; // Keep message channel open for async response
  } else if (message.type === "setMode") {
    filteringMode = message.mode;
    chrome.storage.local.set({ filteringMode: message.mode }, () => {
      sendResponse({ status: "ok" });
    });
    return true;
  }
});

let closedCount = 0;

function saveCount() {
  chrome.storage.local.set({ closedCount });
}

function loadCount() {
  chrome.storage.local.get("closedCount", (result) => {
    if (result.closedCount !== undefined)
      closedCount = result.closedCount;
  });
}
loadCount();

function shouldCheckWebsite(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Skip checking certain system/utility sites
    const skipSites = [
      'chrome.google.com', 'chrome://', 'about:', 'moz-extension://',
      'chrome-extension://', 'edge://', 'opera://', 'localhost'
    ];
    
    if (skipSites.some(site => url.includes(site))) {
      return false;
    }
    
    // Check all http/https websites
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (e) {
    return false;
  }
}

function isEducationalContent(url, title) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Educational websites that should be allowed
    const educationalSites = [
      'khanacademy.org', 'coursera.org', 'edx.org', 'udemy.com', 'byjus.com',
      'unacademy.com', 'vedantu.com', 'toppr.com', 'embibe.com', 'aakash.ac.in',
      'wikipedia.org', 'stackoverflow.com', 'github.com'
    ];
    
    if (educationalSites.some(site => hostname.includes(site.toLowerCase()))) {
      return true;
    }
    
    return false;
  } catch (e) {
    return false;
  }
}

async function checkWithAI(title, exam, url = '', mode = 'strict') {
  const prompt = `
You are an expert educational assistant. Your task is to answer strictly "yes" or "no".

Is the following content relevant for students preparing for the "${exam}" exam?

Content Title: "${title}"
URL: "${url}"
Filtering Mode: ${mode}

Rules based on mode:
- Strict: Only core ${exam} syllabus topics allowed
- Moderate: ${exam} topics + general study skills + educational content
- Relaxed: Educational content + brief breaks allowed

- Answer "yes" if the content is appropriate for the selected mode and exam
- Answer "no" if it's distracting or inappropriate
- Do not explain your answer.
`.trim();



  const apiKey = await getApiKey();
  if (!apiKey) {
    console.warn('🔑 No API key available, blocking content by default in strict/moderate modes');
    return mode === 'relaxed'; // Only allow in relaxed mode when no AI available
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        max_tokens: 20,
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    console.log("📺 Title:", title);
    console.log("🤖 AI Response:", reply);

    return reply?.startsWith("yes");
  } catch (err) {
    console.error("❌ Groq API error:", err);
    return mode === 'relaxed'; // Only allow in relaxed mode on API error
  }
}

async function checkAllTabs() {
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!tab.title || !tab.url || !shouldCheckWebsite(tab.url)) continue;

    // Skip if it's an educational website
    if (isEducationalContent(tab.url, tab.title)) {
      console.log(`📚 Educational content kept: ${tab.title}`);
      continue;
    }

    // Check ALL websites for relevance
    const isRelated = await checkWithAI(tab.title, selectedExam, tab.url, filteringMode);
    if (!isRelated) {
      console.log(`🚫 Closing irrelevant tab: ${tab.title}`);
      try {
        await chrome.tabs.remove(tab.id);
        incrementClosedCount();
      } catch (e) {
        console.warn("⚠️ Failed to close tab:", e);
      }
    } else {
      console.log(`✅ Kept relevant tab: ${tab.title}`);
    }
  }
}

function incrementClosedCount() {
  closedCount++;
  saveCount();

  chrome.storage.local.get("closedCountsByDay", (data) => {
    const counts = data.closedCountsByDay || {};
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    counts[today] = (counts[today] || 0) + 1;
    chrome.storage.local.set({ closedCountsByDay: counts });
  });
}

// Removed unused YouTube-specific tab tracking

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && changeInfo.title && shouldCheckWebsite(tab.url)) {
    const title = changeInfo.title.trim();
    const skipTitles = ["New Tab", "Home", "Loading", "Untitled"];
    const isTooGeneric = skipTitles.includes(title) || title.length < 5;

    if (isTooGeneric) return;

    // Skip educational content
    if (isEducationalContent(tab.url, title)) return;

    // Check ALL websites for relevance
    (async () => {
      const isRelated = await checkWithAI(title, selectedExam, tab.url, filteringMode);
      if (!isRelated) {
        console.log(`🚫 Closing (onUpdated): ${title}`);
        try {
          await chrome.tabs.remove(tabId);
          incrementClosedCount();
        } catch (e) {
          console.warn("⚠️ Failed to close tab (onUpdated):", e);
        }
      } else {
        console.log(`✅ Kept (onUpdated): ${title}`);
      }
    })();
  }
});

// Removed unused tab tracking code

setInterval(checkAllTabs, 5 * 60 * 1000);

// Load saved settings on startup
chrome.storage.local.get(['selectedExam', 'filteringMode'], (result) => {
  if (result.selectedExam) selectedExam = result.selectedExam;
  if (result.filteringMode) filteringMode = result.filteringMode;
});
