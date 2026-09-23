document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('#verifyButton');
  const form = document.querySelector('#verificationForm');
  const close = document.querySelector('#closeVerification');
  const file = document.querySelector('#idFile');
  const fileName = document.querySelector('#fileName');
  const error = document.querySelector('#uploadError');
  const docs = document.querySelector('#verificationDocs');
  const score = document.querySelector('#trustScore');
  const meter = document.querySelector('#trustMeter');
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  button.addEventListener('click', () => {
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#idType').focus();
  });
  close.addEventListener('click', () => { form.hidden = true; error.textContent = ''; });
  file.addEventListener('change', () => {
    const selected = file.files[0];
    error.textContent = '';
    if (!selected) { fileName.textContent = 'Choose ID document'; return; }
    if (!allowedTypes.includes(selected.type)) {
      file.value = '';
      fileName.textContent = 'Choose ID document';
      error.textContent = 'Upload a valid ID image or PDF only.';
      return;
    }
    if (selected.size > maxSize) {
      file.value = '';
      fileName.textContent = 'Choose ID document';
      error.textContent = 'The ID file must be 10 MB or smaller.';
      return;
    }
    fileName.textContent = selected.name;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const idType = document.querySelector('#idType').value;
    const selected = file.files[0];
    if (!idType || !selected) { error.textContent = 'Choose an accepted ID type and attach the document.'; return; }
    const verification = { idType, fileName: selected.name, status: 'Under review' };
    localStorage.setItem('shopVerification', JSON.stringify(verification));
    docs.querySelector('.pending').className = 'reviewing';
    docs.querySelector('.pending').textContent = `◷ ${idType} · Under review`;
    score.textContent = '90%';
    meter.style.width = '90%';
    button.textContent = 'Document submitted';
    button.disabled = true;
    error.className = 'upload-error success';
    error.textContent = 'Submitted successfully. Admin review is required before full verification.';
    form.querySelector('button[type="submit"]').disabled = true;
  });

  const saved = JSON.parse(localStorage.getItem('shopVerification') || 'null');
  if (saved) {
    docs.querySelector('.pending').className = 'reviewing';
    docs.querySelector('.pending').textContent = `◷ ${saved.idType} · Under review`;
    score.textContent = '90%';
    meter.style.width = '90%';
    button.textContent = 'Document submitted';
    button.disabled = true;
  }
});