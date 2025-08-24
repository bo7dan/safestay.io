function initLoginPage() {
    
    const socialButtons = document.querySelectorAll('.social-login-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('facebook-btn') ? 'Facebook' : 'Google';
            alert(`Redirecting to ${provider} login...`);
        });
    });

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            alert(`Logging in with email: ${email}`);
        });
    }
}

if (document.querySelector('.login-section')) {
    initLoginPage();
}