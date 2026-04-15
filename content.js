// UMT CAPTCHA Auto-Fill Content Script
// Targets: online.umt.edu.pk login page
// CAPTCHA is rendered in <span class="captcha"> and must be typed into an input field
// Developer: Abdul Manan
//   GitHub (Personal): https://github.com/abdulmanan69
//   GitHub (UMT):      https://github.com/abdulmananumt

(function () {
  'use strict';

  /**
   * Reads the CAPTCHA text from the span and fills the matching input field.
   * Returns an object with { success, captchaText, message }.
   */
  function fillCaptcha() {
    // ── 1. Find the CAPTCHA display element ──────────────────────────────────
    const captchaSpan = document.querySelector('span.captcha');
    if (!captchaSpan) {
      return { success: false, captchaText: null, message: 'CAPTCHA element not found on this page.' };
    }

    const captchaText = captchaSpan.innerText.trim();
    if (!captchaText) {
      return { success: false, captchaText: null, message: 'CAPTCHA span is empty.' };
    }

    // ── 2. Find the CAPTCHA input field ──────────────────────────────────────
    // Try common patterns used on the UMT portal
    let captchaInput =
      document.querySelector('input[name*="aptcha" i]') ||
      document.querySelector('input[id*="aptcha" i]') ||
      document.querySelector('input[placeholder*="aptcha" i]') ||
      document.querySelector('input[type="text"][name*="code" i]') ||
      document.querySelector('input[type="text"][id*="code" i]') ||
      null;

    // Fallback: find the text input that comes right after the captcha span
    if (!captchaInput) {
      const allTextInputs = Array.from(document.querySelectorAll('input[type="text"]'));
      // Pick an input that is NOT username/password/email
      captchaInput = allTextInputs.find(inp => {
        const n = (inp.name + inp.id + inp.placeholder).toLowerCase();
        return !n.includes('user') && !n.includes('email') && !n.includes('pass') && !n.includes('login');
      });
    }

    if (!captchaInput) {
      return { success: false, captchaText, message: 'Could not locate the CAPTCHA input field.' };
    }

    // ── 3. Fill the value (native setter so React/Vue listeners fire) ────────
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(captchaInput, captchaText);

    // Dispatch events so any JS validation picks up the change
    captchaInput.dispatchEvent(new Event('input',  { bubbles: true }));
    captchaInput.dispatchEvent(new Event('change', { bubbles: true }));
    captchaInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    // Visual feedback — briefly highlight the filled field
    const originalOutline = captchaInput.style.outline;
    const originalBg     = captchaInput.style.backgroundColor;
    captchaInput.style.outline         = '2px solid #22c55e';
    captchaInput.style.backgroundColor = '#f0fdf4';
    setTimeout(() => {
      captchaInput.style.outline         = originalOutline;
      captchaInput.style.backgroundColor = originalBg;
    }, 2000);

    return { success: true, captchaText, message: `CAPTCHA "${captchaText}" filled successfully.` };
  }

  // ── Auto-run on page load ─────────────────────────────────────────────────
  function autoFill() {
    const result = fillCaptcha();
    if (result.success) {
      console.log(`[UMT CAPTCHA] ${result.message}`);
    } else {
      console.warn(`[UMT CAPTCHA] ${result.message}`);
    }
  }

  // Run once DOM is fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoFill);
  } else {
    autoFill();
  }

  // Also watch for dynamic page changes (SPA navigation / CAPTCHA refresh)
  const observer = new MutationObserver(() => {
    const captchaSpan = document.querySelector('span.captcha');
    if (captchaSpan) {
      // Debounce slightly so the DOM settles
      clearTimeout(window._umtCaptchaTimer);
      window._umtCaptchaTimer = setTimeout(autoFill, 300);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Listen for manual trigger from popup ─────────────────────────────────
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'fillCaptcha') {
      const result = fillCaptcha();
      sendResponse(result);
    }
    return true; // keep channel open for async
  });

})();
