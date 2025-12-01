// registration.js

console.log('registration.js loaded');

const captureBtn = document.getElementById('captureBtn');
const fpStatus = document.getElementById('fpStatus');
const fingerprintInput = document.getElementById('fingerprintTemplate');
const registerBtn = document.getElementById('registerBtn');
const form = document.getElementById('registrationForm');

// When user clicks "Scan Fingerprint"
captureBtn.addEventListener('click', () => {
  // For now, just simulate a fingerprint template
  const fakeTemplate = 'FP-' + Math.floor(Math.random() * 1000000);

  fingerprintInput.value = fakeTemplate;
  fpStatus.textContent = 'Fingerprint captured. Template: ' + fakeTemplate;

  // Enable Register button after fingerprint captured
  registerBtn.disabled = false;
});

// When form is submitted
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const fingerprintTemplate = fingerprintInput.value;

  if (!username) {
    alert('Please enter a username.');
    return;
  }

  if (!fingerprintTemplate) {
    alert('Please scan fingerprint before registering.');
    return;
  }

  const payload = { username, fingerprintTemplate };

  console.log('Submitting registration to backend:', payload);

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Response from /api/register:', data);

    if (data.success) {
      // Redirect to QR page with secret as query param
      const secret = data.secret;
      window.location.href = `/qr.html?secret=${encodeURIComponent(secret)}`;
    } else {
      alert('Registration failed on server: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    console.error('Error while registering:', err);
    alert('Error while registering. Check console for details.');
  }
});
