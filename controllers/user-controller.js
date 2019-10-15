var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



// THIS IS OUR CREATE USER ROUTE! //

router.post('/create', (req, res) => { // Creating a new route to create a user
    let username = req.body.username; // Setting variables to store data from the body of our request
    let pass = req.body.password

    User // Calling our User Model
        .create({ // Using the sequelize create() method.
            username: username,
            password: bcrypt.hashSync(pass, 10) // Using the bcrypt hashSync() method to encrypt the password
        })
        .then( // .then() promise resolver to fire if a user is created
            function createSuccess(user) {

                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24}); // Creating a new jwt and storing it in a variable

                res.json({ // The server will JSONify our data and send it back in a response
                    user: user, // Creating a K/V pair of 'user' and our jsonified 'user' object
                    message: 'User Created!', // K/V pair of 'message and a string
                    sessionToken: token // K/V of sessionToken and our new jwt
                }) 
            },
            function createError(err) { // If an error occurs
                res.send(500, err.message) // Server responds with an error message
            }
        )

});


// THIS IS OUR LOGIN ROUTE //

router.post('/login', (req, res) => { // creating a new login route

    User.findOne({ where: {username: req.body.user.username}}) // using sequelie findOne() method, telling it 'where' to look in this case the username column of our table and compare that to user name in our req

    .then( // .then() promise resolver to fire after our findOne method
        function(user) {
            if(user){ // If we found a user
                bcrypt.compare(req.body.user.password, user.password, function(err, matches){ // compare the encrypted password associated with that user using .compare()
                    if(matches){ // If the password matches
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24}); // Creating a new jwt and storing it in a variable
                        res.json({ // The server will JSONify our data, attacth a new sessionToken and respond with our JSON object
                            user: user,
                            message: 'Successfully Authenticated',
                            sessionToken: token
                        })
                    } else { // If our password doesn't match
                        res.status(502).send('Failed to Authenticate')
                    }
                })
            } else { // No user could be found
                res.status(500).send({error: 'Failed to Find User'})
            }
        },
        function(err) { // our promise could not be resolved
            res.status(501).send({err: 'An error occured'})
        }
    )
})


module.exports = router;