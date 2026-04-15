<div align="center">

<img src="icon.png" width="80" height="80" alt="Extension Icon" />

# 🔐 UMT CAPTCHA Auto-Fill

### A Chrome Extension for [online.umt.edu.pk](https://online.umt.edu.pk)

Automatically detects and fills the login CAPTCHA on the UMT Student Portal — no more squinting at distorted characters.

<br/>

![Manifest V3](https://img.shields.io/badge/Manifest-V3-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-Extension-f97316?style=for-the-badge&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-818cf8?style=for-the-badge)

<br/>

</div>

---

## ✨ Features

- ⚡ **Auto-fills on page load** — no clicks needed, CAPTCHA is filled the moment the login page loads
- 🔄 **Watches for CAPTCHA refresh** — if the CAPTCHA changes after a failed login, it auto-fills the new one instantly
- 🎯 **Precise targeting** — reads directly from `<span class="captcha">` and injects into the correct input field
- 🖥️ **Clean popup UI** — shows the detected CAPTCHA value with a one-click manual fill button
- 🔗 **Quick access button** — open the UMT login page directly from the extension popup
- 💡 **Zero configuration** — install and it just works

---

## 📸 Preview

```
┌─────────────────────────────────┐
│  🔐  UMT CAPTCHA Auto-Fill      │
│       online.umt.edu.pk         │
├─────────────────────────────────┤
│  ✅  CAPTCHA detected           │
│      Ready to auto-fill         │
├─────────────────────────────────┤
│       F6Rb6  (detected)         │
├─────────────────────────────────┤
│       [ Fill CAPTCHA ]          │
│       [ Open UMT Login ]        │
├─────────────────────────────────┤
│  Developed by  🐙 abdulmanan69  │
└─────────────────────────────────┘
```

---

## 🚀 Installation

> **No Chrome Web Store needed** — load it directly as an unpacked extension.

### Step 1 — Download

```bash
git clone https://github.com/abdulmananumt/umt-captcha-autofill.git
```

Or download the ZIP from the [Releases](../../releases) page and extract it.

### Step 2 — Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **Developer mode** ON (top-right corner)
3. Click **"Load unpacked"**
4. Select the extracted `umt-captcha-extension` folder
5. ✅ Done — the extension is now active!

---

## 🧠 How It Works

```
Page loads on online.umt.edu.pk
        │
        ▼
content.js reads <span class="captcha">
        │
        ▼
Extracts the CAPTCHA text (e.g. "F6Rb6")
        │
        ▼
Finds the CAPTCHA input field
        │
        ▼
Injects value + fires input/change events
        │
        ▼
✅ Field is filled automatically
```

The extension also uses a **MutationObserver** to watch for DOM changes. If the CAPTCHA is refreshed or the page navigates dynamically, it re-fills the new value within 300ms.

---

## 📁 Project Structure

```
umt-captcha-extension/
│
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Core logic — detects & fills CAPTCHA
├── popup.html          # Extension popup UI
├── popup.js            # Popup interactions & status updates
├── icon.png            # Extension icon
└── README.md           # You're reading this!
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Manifest V3** | Chrome Extension platform |
| **Vanilla JS** | Content script & popup logic |
| **MutationObserver API** | Watches for dynamic CAPTCHA changes |
| **Chrome Scripting API** | Reads DOM from popup context |
| **Chrome Tabs API** | Opens UMT login & GitHub links |

---

## ⚙️ Permissions Used

| Permission | Reason |
|---|---|
| `activeTab` | Read current tab's DOM to detect CAPTCHA |
| `scripting` | Inject CAPTCHA value into the input field |
| `host_permissions` | Scoped to `online.umt.edu.pk` only |

> 🔒 This extension **only** runs on `online.umt.edu.pk`. It does not collect, store, or transmit any data.

---

## 🤝 Contributing

Pull requests are welcome! If the UMT portal updates its HTML structure, feel free to open an issue or submit a fix.

1. Fork the repo
2. Create your branch: `git checkout -b fix/captcha-selector`
3. Commit your changes: `git commit -m 'fix: update captcha selector'`
4. Push: `git push origin fix/captcha-selector`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 👨‍💻 Developer

<br/>

Made with ❤️ by **Abdul Manan**

<br/>

[![GitHub Personal](https://img.shields.io/badge/GitHub-abdulmanan69-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/abdulmanan69)
&nbsp;&nbsp;
[![GitHub UMT](https://img.shields.io/badge/GitHub-abdulmananumt-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/abdulmananumt)

<br/>

*If this saved you time, consider giving it a ⭐ star!*

<br/>

</div>
