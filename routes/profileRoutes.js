import express from 'express';
import { profileController, studentController } from '../controllers/controllers.js';

const router = express.Router();

router.get('/profile/me', (req,res) => {
    res.status(200).render('view-profile', { title : "Profile" });
})

router.get('/profile/me/update', (req,res) => {
    res.status(200).render('edit-profile', { title : "Edit Profile" });
});

router.put('/profile/me/update', studentController.updateStudent);

router.get('/profile/me/privacy', (req,res) => {
    res.status(200).render('privacy-settings', { title : "Privacy Settings" });
});

router.put('/profile/me/privacy', studentController.updateStudent);

router.delete('/profile/me/privacy', studentController.deleteStudent);

router.get("/profile/:universityId", profileController.showProfile);

export default router;
