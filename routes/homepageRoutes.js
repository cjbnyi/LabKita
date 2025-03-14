import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('index', {
        title: 'LabKita!'
    });
});

router.get('/about', (req, res) => {
    res.status(200).render('about-us', {
        title: 'LabKita!'
    });
});

export default router;
