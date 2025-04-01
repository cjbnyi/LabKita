import { initializeLogForms } from './authScripts.js';

initializeLogForms();

document.addEventListener('DOMContentLoaded', () => {
    const userType = localStorage.getItem('userType') || null;

    window.isLoggedInAsStudent = userType === 'student';
    window.isLoggedInAsAdmin = userType === 'admin';

    console.log('Student:', window.isLoggedInAsStudent);
    console.log('Admin:', window.isLoggedInAsAdmin);

    console.warn('Access token is now stored in cookies. Ensure your backend extracts it from req.cookies.');
});
