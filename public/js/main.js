// import adminPanelScripts from './adminPanelScripts.js';
import { initializeLogForms } from './authScripts.js';
// import homepageScripts from './homepageScripts.js';
// import manageReservationsScripts from './manageReservationsScripts.js';
// import profileScripts from './profileScripts.js';
// import searchUsersScripts from './searchUsersScripts.js';
// import viewLabsScripts from './viewLabsScripts.js';

initializeLogForms();

document.addEventListener('DOMContentLoaded', () => {
    const userType = localStorage.getItem('userType');

    if (userType === 'student') {
        window.isLoggedInAsStudent = true;
        window.isLoggedInAsAdmin = false;
    } else if (userType === 'admin') {
        window.isLoggedInAsStudent = false;
        window.isLoggedInAsAdmin = true;
    } else {
        window.isLoggedInAsStudent = false;
        window.isLoggedInAsAdmin = false;
    }

    console.log('Student:', window.isLoggedInAsStudent);
    console.log('Admin:', window.isLoggedInAsAdmin);

    // Access token is now stored in cookies
    console.warn('Access token is now stored in cookies. Ensure your backend extracts it from req.cookies.');
});
