const auth = function (req, res, next){
    if(req.session.user.rol !== 'admin'){
        return res.redirect('/');
    }
    return next();
}

export default auth;