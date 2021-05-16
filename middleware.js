const Subject = require("./models/subject");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.session.error =  'You must be signed in first!';
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.session.returnTo = req.originalUrl
        req.session.error =  'You must be an Admin!';
        return res.redirect('back');
    }
    next();
}

module.exports.isTeacher = async (req, res, next) => {
    const {subjectId} = req.params;
    const subject = await Subject.findById(subjectId);
    if(!subject.teachers.includes(req.user._id)) {
        req.session.error =  'You dont have permission to generate this paper!';
        return res.redirect('back');
    } 
    next();
}