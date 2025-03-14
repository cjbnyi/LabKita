export function initializeLogForms() {
    $(document).ready(function () {
        $('#loginForm').submit(function (event) {
            event.preventDefault(); // Prevent default form submission
        
            let email = $('input[name="email"]').val();
            let password = $('input[name="password"]').val();
        
            $.ajax({
                url: '/api/auth/login',
                method: 'POST', // Ensure it's POST
                contentType: 'application/json', // Ensures JSON body
                data: JSON.stringify({ email, password }), // Send data properly
                success: function (data) {
                    localStorage.setItem('userType', data.userType);
                    window.location.href = '/'; // Redirect on success
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'Invalid credentials';
                    $('#errorMessage').text(errorMessage).show();
                }
            });
        });

        $('#signupForm').submit(function (event) {
            event.preventDefault(); // Stop page reload
            
            let universityID = $('#universityID').val();
            let email = $('#email').val();
            let password = $('#password').val();
            let confirmPassword = $('#confirm-password').val();
    
            // Check if passwords match
            if (password !== confirmPassword) {
                $('#errorMessage').text('Passwords do not match').show();
                return;
            }
    
            // Send AJAX request
            $.ajax({
                url: '/api/auth/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ universityID, email, password }),
                success: function (data) {
                    console.log("Signup success:", data);
                    alert('Signup successful! Redirecting to profile...');
                    window.location.href = '/api/profile/me/update';
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseJSON ? xhr.responseJSON.error : 'Signup failed';
                    $('#errorMessage').text(errorMessage).show();
                }
            });
        });
    });
}