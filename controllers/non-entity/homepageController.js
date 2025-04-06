const renderIndex = (req, res) => {
    res.status(200).render('index', {
        title : 'LabKita!',
        user : res.locals.user
    });
}

const renderAboutUs = (req, res) => {
    res.status(200).render('about-us', {
        title : 'LabKita!',
        aboutusCSS : '/public/css/about-us.css'
    });
}

export default {
    renderIndex,
    renderAboutUs
};
