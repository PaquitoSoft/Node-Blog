
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
