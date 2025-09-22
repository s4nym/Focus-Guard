
# 🔒 Focus Guard

**Focus Guard** is a Chrome extension designed to help students stay focused by monitoring and filtering your tabs. It automatically flags or closes tabs containing content unrelated to competitive exams like **JEE** or **NEET**, helping users avoid distractions and stay productive.

## 🎯 Features

- 🔍 **Real-time Analysis**: Analyzes Tab titles as you browse
- ✅ **Smart Filtering**: Allows only JEE/NEET-related educational content
- 🚫 **Auto-blocking**: Flags or closes irrelevant tabs automatically
- ⚙️ **Background Operation**: Runs silently with minimal system resource usage
- 🎓 **Exam-focused**: Specifically designed for competitive exam preparation
- 🤖 **AI-powered**: Uses advanced AI to determine content relevance

## 🧠 Use Cases

**Perfect for:**
- 📚 Students preparing for JEE (Joint Entrance Examination)
- 🩺 Students preparing for NEET (National Eligibility cum Entrance Test)
- 👨‍👩‍👧‍👦 Parents monitoring their children's study habits
- 🎯 Anyone seeking to maintain focus during online learning sessions
- 📈 Students looking to improve their productivity and study discipline

## 🚀 Installation

### Chrome Extension Setup
1. **Download**: Clone or download this repository to your computer
2. **Access Extensions**: Open Chrome and navigate to `chrome://extensions/`
3. **Enable Developer Mode**: Toggle **Developer Mode** in the top right corner
4. **Load Extension**: Click **Load Unpacked** and select the Focus Guard folder
5. **Activate**: The Focus Guard icon will appear in your Chrome toolbar
6. **Configure**: Click the extension icon and select your target exam (JEE/NEET)

### Quick Start
- Once installed, the extension runs automatically in the background
- Visit YouTube and browse as usual
- The extension will monitor and filter content based on your selected exam focus
- Irrelevant tabs will be flagged or closed according to your settings

## 📝 How It Works

Focus Guard employs intelligent content analysis to maintain your study focus:

1. **Content Monitoring**: Continuously scans YouTube video titles and descriptions
2. **AI Analysis**: Uses Groq API to determine if content is exam-related
3. **Smart Filtering**: Applies regex-based filtering combined with AI insights
4. **Action Execution**: Automatically handles non-educational content based on your preferences
5. **Background Processing**: All operations run seamlessly without interrupting your workflow

## 🛠️ Technology Stack

- **Frontend**: JavaScript (ES6+), HTML5, CSS3
- **AI Integration**: Groq API for natural language processing
- **Content Filtering**: Custom regex patterns and keyword matching
- **Platform**: Chrome Extensions API (Manifest V3)
- **Architecture**: Background service worker with content script injection

## 📷 Screenshots

*Extension Interface and Filtering in Action*

![Focus Guard Interface](https://github.com/user-attachments/assets/34ef6616-7e1a-4268-9d23-e93a2eec513c)

## 🔧 Configuration

### API Setup
You can customize the extension by using your own Groq API key:
1. Obtain your API key from [Groq Console](https://console.groq.com/)
2. Replace the default key in the `background.js` file
3. Reload the extension in Chrome

### Customization Options
- **Exam Selection**: Choose between JEE, NEET, or custom exam patterns
- **Action Modes**: Configure whether to flag, warn, or close irrelevant tabs
- **Sensitivity**: Adjust the strictness of content filtering
- **Whitelist**: Add trusted educational channels to bypass filtering

## 📜 Open Source & Licensing

### License Information
This project is released under a **Custom Proprietary License**. Please note the following important points:

- **Copyright**: © 2025 Sanyam Sood. All rights reserved.
- **Usage Restrictions**: This software is **not open source** under traditional definitions
- **Modification**: You may **not** copy, distribute, reproduce, or modify any part of this software without express written permission
- **Commercial Use**: Commercial use is strictly prohibited without authorization
- **Educational Use**: Personal and educational use is permitted as intended

### Why This Licensing Model?
Focus Guard uses a proprietary license to:
- 🛡️ Protect the intellectual property and innovative AI integration
- 🎓 Ensure the tool remains focused on educational purposes
- 🔒 Maintain quality control and prevent misuse
- 💡 Support continued development and improvement

### Contact for Licensing
For licensing inquiries, commercial use, or collaboration opportunities:
- **Email**: sanyamsood14@gmail.com
- **Subject**: Focus Guard Licensing Inquiry

### Contributing
While the code is proprietary, we welcome:
- 🐛 Bug reports and issue submissions
- 💡 Feature suggestions and improvements
- 🧪 Beta testing and feedback
- 📖 Documentation improvements

## 🤝 Support & Community

- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit enhancement ideas
- **Feedback**: Share your experience and suggestions
- **Updates**: Stay informed about new releases

## ⚠️ Disclaimer

Focus Guard is designed as a productivity tool for educational purposes. It should be used responsibly and in conjunction with proper study habits. The effectiveness of content filtering may vary based on video titles and descriptions. Always verify the educational value of content yourself.

## 🚀 Future Roadmap

- 📱 Mobile app version for Android/iOS
- 🌐 Support for additional educational platforms
- 🎯 More exam categories (CAT, GATE, etc.)
- 📊 Advanced analytics and study tracking
- 🤝 Integration with popular learning management systems

---

**Made with ❤️ for students aspiring to achieve their educational goals**

*Focus Guard - Your Digital Study Companion*
