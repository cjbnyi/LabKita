// entity controllers
import adminController from './entity/adminController.js';
import labController from './entity/labController.js';
import reservationController from './entity/reservationController.js';
import seatController from './entity/seatController.js';
import studentController from './entity/studentController.js';

// non-entity controllers
import adminPanelController from './non-entity/adminPanelController.js';
import authController from './non-entity/authController.js';
import homepageController from './non-entity/homepageController.js';
import manageReservationController from './non-entity/manageReservationController.js';
import profileController from './non-entity/profileController.js';
import searchUsersController from './non-entity/searchUsersController.js';
import viewLabsController from './non-entity/viewLabsController.js';

export {
    // entity controllers
    adminController,
    labController,
    reservationController,
    seatController,
    studentController,

    // non-entity controllers
    adminPanelController,
    authController,
    homepageController,
    manageReservationController,
    profileController,
    searchUsersController,
    viewLabsController
};
