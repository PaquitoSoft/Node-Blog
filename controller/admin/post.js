
/**
 * Managing posts
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