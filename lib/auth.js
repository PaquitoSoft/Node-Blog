var url = require('url');
var domain = require('../domain.js');
var sys = require('sys');

// Here we define the authorization rules.
//  Put the more restrictive rules at the top
var config = [
    {
        pattern: /^\/admin\/secure(\/)?(?:([^?#]*))?$/, // /admin/secure[/]*
        roles: ['admin']
    },
    {
        pattern: /^\/admin(\/)?(?:([^?#]*))?$/, // regex for '/admin[/]*'
        roles: ['user', 'admin']        
    }
    
];
  

module.exports = function auth(expressApp) {
    
    // This application uses the following roles: 'guest', 'user' and 'admin'
    
    // Module handler
    return function auth(req, res, next) {
        console.log("Auth::query# Testing url for authorization: " + req.url);
        var path = url.parse(req.url).pathname,
            len = config.length,
            rule = null;
        for (var i = 0; i < len; i++) {
            if (config[i].pattern.test(path)) {
                rule = config[i];
                break;
            }        
        }
        
        if (rule) {            
            console.log("Auth module# Se ha solicitado una URL protegida: " + path);
            console.log("Auth module# El usuario debe tener alguno de estos roles: " + rule.roles);
            
            // Get the user            
            var user = req.session.currentUser,
                userValidRole = null;
            if (user) {
                // TODO Validate user roles
                for (i = 0; i < rule.roles.length; i++) {                    
                    if (rule.roles[i] == user.role) {
                        return next();                        
                    }
                }
                console.log('Auth module# User does not have required role. User role : ' + user.role);
                res.render('403', {
                    layout: false
                });
            } else {
                // User is not logged. Send her to the login page.
                req.session.requestedAuthUrl = path;
                res.redirect('/login');                
            }
            
        } else {
            next();
        }
        
    };
  
};