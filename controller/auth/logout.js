
/**
 * Function used to log out the current user.
 */
expressApp.get('/logout', function(req, res, next) {
    console.log('Controller::logout# Entering...');
    req.session.destroy();
    res.redirect('/');
});
