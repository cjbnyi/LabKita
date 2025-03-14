document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.userType === 'student') {
                localStorage.setItem('userType', 'student');
            } else if (data.userType === 'admin') {
                localStorage.setItem('userType', 'admin');
            }

            alert('Login successful!');
            window.location.href = '/'; // Change to your actual home page URL

        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
