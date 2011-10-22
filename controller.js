var mongoose = require('mongoose'),
    domain = require('./domain.js'),
    sys = require('sys');

exports.init = function(expressApp) {
    
    /**
     * Home page controller 
     */
    expressApp.get('/', function(req, res, next) {    
        // We look for the fresh posts
        var query = domain.Post.find({}).limit(4).desc('postedAt');
        query.exec(function(err, posts) {
            if (err) {
                next(err);
            } else {
                res.render('index', {
                    title: 'Yabe Home',
                    frontPost: posts[0],
                    'freshPosts': posts.slice(1)
                });
            }
        });    
            
    });
    
    /**
     * Show the details of a post.
     * Comments creation is allowed.
     */ 
    expressApp.get('/post/:postId', function(req, res, next) {
        // Look for the requested post
        domain.Post.findById(req.params.postId, function(err, post) {
            if (err) {
                next(err);
            } else {
                res.render('post', {
                    title: post.title,
                    'post': post
                });
            }
        });
    });
    
    expressApp.post('/post/:postId/comments', function(req, res, next) {
        // TODO Validar los parametros de entrada
        // Look for the current post    
        domain.Post.findById(req.params.postId, function(err, post) {
            if (err || !post) {
                next(post ? new Error('Post not found! Id: ' + req.params.postId) : err);
            } else {
                // Let's add the new comment
                var comment = new domain.Comment({
                    author: req.body.author,
                    content: req.body.content,
                    postedAt: new Date()
                });
                post.comments.push(comment);
                post.save(function(err) {
                    if (err) {
                        next(err);
                    } else {
                        console.log("Vamos a volver a la pagina del post con el nuevo comentario");
                        res.render('post', {
                            title: post.title,
                            'post': post
                        });
                    }
                });
            }
        });
    });
    
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
    
    /**
     * Function used to log out the current user.
     */
    expressApp.get('/logout', function(req, res, next) {
        console.log('Controller::logout# Entering...');
        req.session.destroy();
        res.redirect('/');
    });
    
    /**
     * Administration zone home controller
     */
    expressApp.get('/admin', function(req, res, next) {
        console.log('controller::adminHome# entering...');
        // Load all user's posts
        domain.Post.byAuthor(req.session.currentUser.email, function(err, posts) {
            if (err) return next(err);
                res.render('admin', {
                title: 'Administration',
                userPosts: posts,
                layout: 'adminLayout'
            });    
        });
        
    });

    /**
     * Managing post controllers
     */
     expressApp.get('/admin/post/:postId?', function(req, res, next) {
        console.log("Controller::adminPostGet# Entering...");
        domain.Post.findById(req.params.postId, function(err, post) {
            if (err) return next(err);
            res.render('post/manage_post', {
                title: post ? post.title : 'Create a new post',
                'post': post,
                layout: 'adminLayout'
            });        
        });
     });
    expressApp.post('/admin/post', function(req, res, next) {
        console.log("Controller::adminPostPost# Entering...");
        var post;
        if (req.body.postId) {
            // Editar post existente
            domain.Post.findById(req.body.postId, function(err, post) {
                if (err) return next(err);
                post.title = req.body.title;
                post.content = req.body.postContent;
                post.tags = req.body.tags;                
            });
        } else {
            // Guardar nuevo post
            post = new domain.Post({
                author: req.session.currentUser.email,
                title: req.body.title,
                content: req.body.postContent,
                tags: req.body.tags
            });
        }
        post.save(function(err) {
            if (err) return next(err);
            res.redirect('/admin');
        });
     });

};

