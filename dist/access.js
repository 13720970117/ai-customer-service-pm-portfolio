const PASSWORD_HASH = 'c7e616822f366fb1b5e0756af498cc11d2c0862edcb32ca65882f622ff39de1b';

const form = document.querySelector('.access-form');
const gate = document.querySelector('.access-gate');
const passwordInput = document.querySelector('#access-password');
const errorMessage = document.querySelector('.access-error');
const protectedElements = document.querySelectorAll('body > .site-header, body > main, body > footer');

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function lockPortfolio() {
  document.body.classList.add('access-locked');
  gate.hidden = false;
  protectedElements.forEach((element) => { element.hidden = true; });
  passwordInput.value = '';
  passwordInput.removeAttribute('aria-invalid');
  errorMessage.textContent = '';
  requestAnimationFrame(() => passwordInput.focus());
}

function unlockPortfolio() {
  protectedElements.forEach((element) => { element.hidden = false; });
  document.body.classList.remove('access-locked');
  gate.hidden = true;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submittedHash = await sha256(passwordInput.value.trim());

  if (submittedHash === PASSWORD_HASH) {
    unlockPortfolio();
    return;
  }

  passwordInput.value = '';
  passwordInput.setAttribute('aria-invalid', 'true');
  errorMessage.textContent = '密码错误，请重新输入。';
  passwordInput.focus();
});

passwordInput.addEventListener('input', () => {
  passwordInput.removeAttribute('aria-invalid');
  errorMessage.textContent = '';
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) lockPortfolio();
});
