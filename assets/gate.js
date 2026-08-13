/* Passphrase gate — DELIBERATE OBSCURITY, NOT SECURITY.
 *
 * This keeps casual visitors out of a work-in-progress. It does NOT protect the
 * content: everything on the page is present in the DOM and in the public repo,
 * and anyone who opens DevTools or reads the source can bypass this in seconds.
 * Do not put anything here that would be harmful to disclose.
 *
 * If real access control is ever needed, the options are client-side encryption
 * (with a private repo) or putting the site behind Cloudflare Access. See README.
 *
 * ---------------------------------------------------------------------------
 * SETTING THE PASSPHRASE
 *   1. Open set-password.html in a browser (locally — do not deploy it publicly
 *      if you'd rather not advertise the mechanism; it holds no secret either way).
 *   2. Type the passphrase. It shows you a SHA-256 hash.
 *   3. Paste that hash into PASS_HASH below and commit.
 *
 * The plaintext passphrase is never stored in the repo — only its hash. That
 * doesn't make the gate strong, but it does mean a passphrase you reuse
 * elsewhere isn't sitting in public source.
 *
 * Leave PASS_HASH empty to disable the gate entirely.
 * --------------------------------------------------------------------------- */

(function () {
  'use strict';

  var PASS_HASH = 'a5f1ddfc2676812b169a5d29659ff220c1fd48ae286cd51f02f311921e83f108';   // <-- paste the SHA-256 hash from set-password.html

  var STORE_KEY = 'exposome-gate';

  if (!PASS_HASH) {
    if (window.console) console.info('[gate] No passphrase set — page is open. See assets/gate.js.');
    return;
  }

  /* already unlocked this browser session? */
  try {
    if (sessionStorage.getItem(STORE_KEY) === PASS_HASH) return;
  } catch (e) { /* storage blocked — fall through and prompt */ }

  /* hide the page immediately so content never flashes before the prompt */
  var hider = document.createElement('style');
  hider.textContent =
    'body > *:not(#gate) { display: none !important; }' +
    '#gate { position: fixed; inset: 0; z-index: 9999; display: flex;' +
    '  align-items: center; justify-content: center; padding: 24px;' +
    '  background: var(--paper, #fcfcfa); color: var(--ink, #1b1b19);' +
    '  font-family: var(--sans, system-ui, sans-serif); }' +
    '#gate .box { width: 100%; max-width: 430px; border: 1px solid var(--rule, #d9d9d1);' +
    '  border-radius: 3px; background: var(--paper-2, #f4f4f0); padding: 26px 28px 24px; }' +
    '#gate h1 { font-family: var(--serif, Georgia, serif); font-size: 21px; font-weight: 600;' +
    '  margin: 0 0 6px; letter-spacing: -0.01em; }' +
    '#gate p { font-size: 13px; line-height: 1.55; color: var(--ink-3, #77776f); margin: 0 0 16px; }' +
    '#gate form { display: flex; gap: 8px; }' +
    '#gate input { flex: 1 1 auto; font: inherit; font-size: 14px; padding: 8px 11px;' +
    '  color: var(--ink, #1b1b19); background: var(--paper, #fff);' +
    '  border: 1px solid var(--rule-2, #c4c4ba); border-radius: 3px; }' +
    '#gate input:focus { outline: 2px solid var(--accent, #29566f); outline-offset: -1px; }' +
    '#gate button { font: inherit; font-size: 14px; padding: 8px 16px; cursor: pointer;' +
    '  color: var(--paper, #fff); background: var(--accent, #29566f);' +
    '  border: 1px solid var(--accent, #29566f); border-radius: 3px; }' +
    '#gate .err { color: #a8322f; font-size: 13px; margin: 12px 0 0; min-height: 1em; }' +
    '#gate .fine { font-size: 11.5px; margin: 18px 0 0; color: var(--ink-3, #9a9a92); }';
  document.head.appendChild(hider);

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var gate = document.createElement('div');
    gate.id = 'gate';
    gate.innerHTML =
      '<div class="box">'
      + '<h1>Life-Experience Exposome</h1>'
      + '<p>Working draft. Enter the passphrase to view the variable dictionary.</p>'
      + '<form autocomplete="off">'
      + '<input type="password" id="gate-input" placeholder="Passphrase" aria-label="Passphrase" autocomplete="current-password">'
      + '<button type="submit">Enter</button>'
      + '</form>'
      + '<p class="err" id="gate-err" role="alert"></p>'
      + '<p class="fine">Draft material — please do not circulate or cite.</p>'
      + '</div>';
    document.body.appendChild(gate);

    var input = gate.querySelector('#gate-input');
    var err = gate.querySelector('#gate-err');
    input.focus();

    gate.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      sha256Hex(input.value).then(function (h) {
        if (h === PASS_HASH) {
          try { sessionStorage.setItem(STORE_KEY, PASS_HASH); } catch (e2) {}
          gate.remove();
          hider.remove();
        } else {
          err.textContent = 'Incorrect passphrase.';
          input.select();
        }
      }, function () {
        err.textContent = 'This browser cannot verify the passphrase (crypto unavailable).';
      });
    });
  });

  function sha256Hex(text) {
    if (!(window.crypto && window.crypto.subtle)) return Promise.reject(new Error('no subtle crypto'));
    var bytes = new TextEncoder().encode(text);
    return window.crypto.subtle.digest('SHA-256', bytes).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('00' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

})();
