export function initializeLogForms() {
    $(document).ready(function () {
        $('#loginForm').submit(function (event) {
            event.preventDefault();
        
            let email = $('input[name="email"]').val();
            let password = $('input[name="password"]').val();
        
            $.ajax({
                url: '/api/auth/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
                xhrFields: { withCredentials: true },
                success: function (data) {
                    localStorage.setItem('userType', data.userType);
                    window.location.href = '/'; 
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseJSON?.error || 'Invalid credentials';
                    $('#errorMessage').text(errorMessage).show();
                }
            });            
        });        

        $('#signupForm').submit(function (event) {
            event.preventDefault(); // Stop page reload
        
            let universityID = $('#universityID').val().trim();
            let email = $('#email').val().trim();
            let password = $('#password').val();
            let confirmPassword = $('#confirm-password').val();
            let $button = $('button[type="submit"]');
        
            // Clear previous error message
            $('#errorMessage').hide().text('');
        
            // Validate Student ID (only numbers)
            if (!/^\d+$/.test(universityID)) {
                $('#errorMessage').text('Student ID must be numeric').show();
                return;
            }
        
            // Validate password length
            if (password.length < 8) {
                $('#errorMessage').text('Password must be at least 8 characters').show();
                return;
            }
        
            // Check if passwords match
            if (password !== confirmPassword) {
                $('#errorMessage').text('Passwords do not match').show();
                return;
            }
        
            // Disable button to prevent multiple clicks
            $button.prop('disabled', true).text('Signing up...');
        
            // Send AJAX request
            $.ajax({
                url: '/api/auth/signup',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ universityID, email, password }),
                success: function (data) {
                    alert('Signup successful! Redirecting to profile...');
                    window.location.href = '/api/profile/me/update';
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseJSON?.error || 'Signup failed';
                    $('#errorMessage').text(errorMessage).show();
                    $button.prop('disabled', false).text('Sign Up'); // Re-enable button
                }
            });
        });

        $('#logoutButton').click(function () {
            $.ajax({
                url: '/api/auth/logout',
                method: 'POST',
                xhrFields: { withCredentials: true },
                success: function () {
                    localStorage.removeItem('userType');
                    window.location.href = '/api/auth/login';
                },
                error: function () {
                    alert('Error logging out.');
                }
            });
        });                 
    });
}