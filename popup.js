document.addEventListener("DOMContentLoaded", () => {
  // Force font load trick for Chart.js
  const preload = document.createElement("span");
  preload.style.fontFamily = "'Henny Penny', cursive";
  preload.style.visibility = "hidden";
  preload.style.position = "absolute";
  preload.textContent = ".";
  document.body.appendChild(preload);

  const buttons = document.querySelectorAll(".buttonss .button");
  const modeButtons = document.querySelectorAll(".buttonss .mode-button");
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const apiStatus = document.getElementById('apiStatus');

  // Restore saved focus and draw chart
  chrome.storage.local.get(["selectedExam", "filteringMode", "groqApiKey", "closedCountsByDay"], (data) => {
    // Restore selected exam button
    const savedExam = data.selectedExam || 'jee';
    const savedButton = document.getElementById(savedExam);
    if (savedButton) {
      savedButton.classList.add("active");
    }

    // Restore selected filtering mode
    const savedMode = data.filteringMode || 'strict';
    const savedModeButton = document.getElementById(savedMode);
    if (savedModeButton) {
      savedModeButton.classList.add("active");
    }

    // Check API key status
    if (data.groqApiKey) {
      apiStatus.textContent = '✓ API key configured';
      apiStatus.className = 'api-status success';
      apiKeyInput.placeholder = 'API key is set (hidden for security)';
    } else {
      apiStatus.textContent = '⚠ No API key configured - extension will work in limited mode';
      apiStatus.className = 'api-status warning';
    }

    const storedCounts = data.closedCountsByDay || {};
    const defaultCounts = {
      'Sun': 0,
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0
    };

    // Merge so that all days appear on the graph, even if zero count
    const counts = { ...defaultCounts, ...storedCounts };

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const ctx = document.getElementById('myChart').getContext('2d');

    // Wait for fonts to load before drawing the chart
    document.fonts.ready.then(() => {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Website Closed Count',
            data: values,
            borderColor: 'rgb(0, 128, 128)',
            backgroundColor: 'rgba(0, 128, 128, 0.3)',
            pointStyle: 'circle',
            pointRadius: 6,
            pointHoverRadius: 10,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Website Closures Over Days',
              font: {
                family: "'Henny Penny', cursive",
                size: 22,
                weight: '400'
              },
              color: '#003333'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
                stepSize: 1,
                precision: 0,
              }
            }
          }
        }
      });
    });
  });

  // Handle exam button clicks
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Save selected exam
      chrome.storage.local.set({ selectedExam: button.id });

      // Notify background script if needed
      chrome.runtime.sendMessage(
        { type: "setExam", exam: button.id },
        (response) => {
          if (response?.status === "ok") {
            console.log("Exam updated to", button.id);
          }
        }
      );
    });
  });

  // Handle filtering mode button clicks
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Save selected mode
      chrome.storage.local.set({ filteringMode: button.id });

      // Notify background script
      chrome.runtime.sendMessage(
        { type: "setMode", mode: button.id },
        (response) => {
          if (response?.status === "ok") {
            console.log("Filtering mode updated to", button.id);
          }
        }
      );
    });
  });

  // Handle API key saving
  saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      apiStatus.textContent = 'Please enter a valid API key';
      apiStatus.className = 'api-status error';
      return;
    }

    if (!apiKey.startsWith('gsk_')) {
      apiStatus.textContent = 'Invalid Groq API key format';
      apiStatus.className = 'api-status error';
      return;
    }

    chrome.storage.local.set({ groqApiKey: apiKey }, () => {
      apiStatus.textContent = '✓ API key saved successfully';
      apiStatus.className = 'api-status success';
      apiKeyInput.value = '';
      apiKeyInput.placeholder = 'API key is set (hidden for security)';
      
      // Notify background script
      chrome.runtime.sendMessage(
        { type: "setApiKey", apiKey: apiKey },
        (response) => {
          if (response?.status === "ok") {
            console.log("API key updated successfully");
          }
        }
      );
    });
  });

  // Handle Enter key in API input
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveApiKeyBtn.click();
    }
  });
});
