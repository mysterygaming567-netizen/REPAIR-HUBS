document.addEventListener('DOMContentLoaded', () => {
	const roleToggle = document.querySelector('#roleToggle');
	const roles = [...document.querySelectorAll('.role')];
	const form = document.querySelector('#loginForm');
	const yahooButton = document.querySelector('#yahooSignIn');
	const result = document.querySelector('#result');
	let role = 'customer';
	const destinations = { customer: '../dashboard/dashboard.html', shop: '../shop/shop.html', admin: '../admin/admin.html' };
	const firebaseConfig = window.REPAIRHUB_FIREBASE_CONFIG;

	const showResult = (message, type = 'err') => {
		result.textContent = message;
		result.className = `result ${type}`;
	};

	if (!firebaseConfig?.apiKey || !firebaseConfig?.authDomain || !firebaseConfig?.projectId) {
		yahooButton.classList.add('is-disabled');
		yahooButton.title = 'Add Firebase settings in firebase-config.js';
		showResult('Yahoo sign-in needs Firebase settings in firebase-config.js.', 'err');
	} else {
		firebase.initializeApp(firebaseConfig);
		const auth = firebase.auth();
		yahooButton.addEventListener('click', async () => {
			yahooButton.disabled = true;
			showResult('Opening Yahoo sign-in...', 'ok');
			try {
				const provider = new firebase.auth.OAuthProvider('yahoo.com');
				const result = await auth.signInWithPopup(provider);
				const user = result.user;
				localStorage.setItem('user', JSON.stringify({
					name: user.displayName || user.email?.split('@')[0] || 'Customer',
					email: user.email || '',
					picture: user.photoURL || '',
					role,
					provider: 'yahoo'
				}));
				showResult(`Signed in as ${user.displayName || 'Customer'}`, 'ok');
				setTimeout(() => { location.href = destinations[role]; }, 450);
			} catch (error) {
				showResult(error.code === 'auth/popup-closed-by-user' ? 'Yahoo sign-in was cancelled.' : 'Yahoo sign-in could not be completed. Check your Firebase setup.');
				yahooButton.disabled = false;
			}
		});
	}

	roleToggle.addEventListener('click', (event) => {
		const button = event.target.closest('.role');
		if (!button) return;
		roles.forEach((item) => item.classList.remove('active'));
		button.classList.add('active');
		role = button.dataset.role;
	});
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const email = document.querySelector('#email').value.trim();
		const password = document.querySelector('#password').value.trim();
		if (!email || !password) return;
		const emailName = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
		const customerName = emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
		const names = { customer: customerName || 'Customer', shop: customerName || 'Repairman', admin: 'Priya Santos' };
		showResult(`Signed in as ${names[role]}`, 'ok');
		localStorage.setItem('user', JSON.stringify({ name: names[role], role, email }));
		setTimeout(() => { location.href = destinations[role]; }, 450);
	});
});
