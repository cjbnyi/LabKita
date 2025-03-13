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
                isLoggedInAsStudent = true;
                isLoggedInAsAdmin = false;
            } else if (data.userType === 'admin') {
                isLoggedInAsStudent = false;
                isLoggedInAsAdmin = true;
            }

            alert('Login successful!'); // You can replace this with a redirect
        } else {
            alert(data.error); // Show error message if login fails
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
