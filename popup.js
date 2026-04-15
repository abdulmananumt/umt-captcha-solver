// popup.js — controls the extension popup UI

const fillBtn     = document.getElementById('fillBtn');
const openBtn     = document.getElementById('openBtn');
const statusTitle = document.getElementById('statusTitle');
const statusMsg   = document.getElementById('statusMsg');
const statusIcon  = document.getElementById('statusIcon');
const captchaBadge = document.getElementById('captchaBadge');

function setStatus(icon, title, msg, badgeText) {
  statusIcon.textContent  = icon;
  statusTitle.textContent = title;
  statusMsg.textContent   = msg;
  if (badgeText) {
    captchaBadge.textContent = badgeText;
    captchaBadge.style.display = 'block';
  } else {
    captchaBadge.style.display = 'none';
  }
}

// ── Check active tab on popup open ──────────────────────────────────────────
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab || !tab.url || !tab.url.includes('online.umt.edu.pk')) {
    setStatus('⚠️', 'Wrong page', 'Navigate to online.umt.edu.pk first');
    fillBtn.disabled = true;
    return;
  }

  // Page is correct — read current CAPTCHA value via scripting
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const span = document.querySelector('span.captcha');
        return span ? span.innerText.trim() : null;
      }
    },
    (results) => {
      const captchaText = results?.[0]?.result;
      if (captchaText) {
        setStatus('✅', 'CAPTCHA detected', 'Ready to auto-fill', captchaText);
        fillBtn.disabled = false;
      } else {
        setStatus('🔍', 'No CAPTCHA found', 'Could not read CAPTCHA from page');
        fillBtn.disabled = true;
      }
    }
  );
});

// ── Manual Fill button ───────────────────────────────────────────────────────
fillBtn.addEventListener('click', () => {
  fillBtn.disabled = true;
  setStatus('⏳', 'Filling…', 'Injecting CAPTCHA into input…');

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: 'fillCaptcha' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        setStatus('❌', 'Error', 'Could not communicate with page. Try reloading.');
        fillBtn.disabled = false;
        return;
      }
      if (response.success) {
        setStatus('🎉', 'Done!', response.message, response.captchaText);
      } else {
        setStatus('❌', 'Failed', response.message);
        fillBtn.disabled = false;
      }
    });
  });
});

// ── Open UMT login page ──────────────────────────────────────────────────────
openBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://online.umt.edu.pk/Account/Login' });
});

// ── GitHub credit links ───────────────────────────────────────────────────────
document.getElementById('githubLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://github.com/abdulmanan69' });
});

document.getElementById('githubLink2').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://github.com/abdulmananumt' });
});
