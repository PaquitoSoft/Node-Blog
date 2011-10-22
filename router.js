var controllers = require('./controller.js');

// Here we configure the bidings between the routing patterns 
// and the controller functions used to handle them.
var routerConfig = [
    /*{
        pattern: '/admin/*',
        controller: function(req, res, next) {
            console.log('-----------------> Pasando por el primer filtro: ' + req.url);
            next();
        }
    },*/
    {
        pattern: '/',
        controller: controllers.publicHome
    },
    {
        pattern: '/post/:postId',
        controller: controllers.postDetails
    },
    {
        pattern: '/post/:postId/comments',
        controller: controllers.addComment,
        method: 'post'
    },
    {
        pattern: '/admin',
        controller: controllers.adminHome
    },
    {
        pattern: '/login',
        controller: controllers.login,
        method: ['guest', 'post']
    },
    {
        pattern: '/logout',
        controller: controllers.logout
    }
];

// Here is where we configure the routes for the application
exports.init = function(expressApp) {    
    var len = routerConfig.length,
        httpMethods;
    for (var i = 0; i < len; i++) {
        if (routerConfig[i].method) {
            console.log(typeof routerConfig[i].method);
            httpMethods = (typeof routerConfig[i].method == Array) ? routerConfig[i].method : [routerConfig[i].method];    
        } else {
            httpMethods = ['get'];
        }        
        console.log('Router::init# httpMethods# httpMethods: ' + httpMethods);
        for (var j = 0; j < httpMethods.length; j++) {
            console.log('Configuring method ' + httpMethods[j] + ' for route ' + routerConfig[i].pattern);
            (function(ci) {
                expressApp[httpMethods[j]](ci.pattern, function(req, res, next) {                
                    ci.controller(req, res, next);
                });    
            })(routerConfig[i]);    
        }
                
    }    
};
