

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

/**
 * Add a comment to a post.
 */
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