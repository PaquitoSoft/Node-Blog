
exports.config = function (expressApplication) {

    expressApplication.error(function(err, req, res, next) {
        console.log(err.stack);
        
        res.render('500', {
            title: 'Internal error', 
            error: err
        });
        
        //next();
    });

};