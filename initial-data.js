var mongoose = require('mongoose'),
    domain = require('./domain.js');

var bob = new domain.User({
    email: 'bob@gmail.com',
    password: 'secret1',
    fullname: 'Bob Sponge',
    role: 'admin'
});

var jeff = new domain.User({
    email: 'jeff@gmail.com',
    password: 'secret2',
    fullname: 'Jeff Bridges'
});



var firstBobPost = new domain.Post({
    title: 'About the model layer',
    author: bob.email,
    postedAt: '2011-10-01 08:00:13',
    content: 'The model has a central position in a Play! application. It is the domain-specific ' +
            'representation of the information on which the application operates.' +                     
            'Martin fowler defines it as: ' +                
            'Responsible for representing concepts of the business, information about the ' +
            'business situation, and business rules. State that reflects the business situation ' + 
            'is controlled and used here, even though the technical details of storing it are ' + 
            'delegated to the infrastructure. This layer is the heart of business software.',
    comments: [
            {
                author: 'Randy Mamola',
                content: 'Martin Fowler rocks!'
            },
            {
                author: 'Rollo Tomassi',
                content: 'But, what about the data access layer. What about Mongoose?'
            }
        ]
});

var secondBobPost = new domain.Post({
    title: 'Just a test of YABE',
    author: bob.email,
    postedAt: '2011-10-08 18:10:13',
    content: 'Well, this is just a test post',
    tags: ['tv shows'],
    comments: [{
        author: 'Hiro Nakamura',
        content: 'Is this a useless post?'
    }]
});

var jeffPost = new domain.Post({
    title: 'The MVC Application',
    author: jeff.email,
    postedAt: '2011-10-11 12:20:00',
    content: 'A Play! application follows the MVC architectural pattern as applied to the ' +
            'architecture of the Web. \n' +                     
            'This pattern splits the application into separate layers: the Presentation ' + 
            'layer and the Model layer. The Presentation layer is further split into a ' + 
            'View and a Controller layer.',
    tags: ['play', 'architecture', 'mvc']    
});


exports.users = [bob, jeff];
exports.posts = [firstBobPost, secondBobPost, jeffPost];
