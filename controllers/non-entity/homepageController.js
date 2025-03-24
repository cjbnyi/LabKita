const renderIndex = (req, res) => {
    res.status(200).render('index', { title : 'LabKita!' });
}

const renderAboutUs = (req, res) => {
    res.status(200).render('about-us', { title : 'LabKita!' });
}

export default {
    renderIndex,
    renderAboutUs
};
