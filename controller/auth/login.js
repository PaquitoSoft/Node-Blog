   
/**
 * Login controller
 */
expressApp.get('/login', function(req, res, next) {
    res.render('login', { 
        layout:false         
    });
});
expressApp.post('/login', function(req, res, next) {        
    domain.User.validate(req.body.username, req.body.password,
        function(err, user) {
            console.log("Controller::login# After validate user against DB.");
            if (err || !user) {
                console.log('Controller::login# User validation failed!');
                // TODO Devolver un mensaje de error al usuario
                res.render('login', {
                    err: !user ? 'Your credentials are not valid' : err,
                    layout: false
                });
            } else {
                console.log('Controller::login# User credentials are ok!');                    
                req.session.currentUser = user;                    
                var destination = req.session.requestedAuthUrl;
                console.log("Controller::login# Redirecting user to requested url: " + destination);
                if (destination) {
                    req.session.requestAuthUrl = null;
                    res.redirect(destination);
                } else {
                    res.redirect('/');
                }                
            }
        }
    );
});
