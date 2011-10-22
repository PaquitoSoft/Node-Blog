

module.exports = function(expressApp) {
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
};
