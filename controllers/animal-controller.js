var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Animal = sequelize.import('../models/animal');


// THIS WILL CREATE A NEW ANIMAL POST IN OUR DB //


router.post('/create', (req, res) => {
    Animal.create({
        name: req.body.name,
        legNumber: req.body.legNumber,
        predator: req.body.predator
    })
    .then(
        function createSuccess(animal){
            res.json({
                animal: animal,
                message: 'Animal Logged'
            })
        },
        function createError(err) {
            res.status(500).send('Failed to log')
        }
    );
});


// THIS WILL DELETE AN ANIMAL BY ID //

router.delete('/delete/:id', (req, res) => {
    
    Animal
        .destroy({where: {id: req.params.id}})
        .then(
            function deleteSuccess(animal){
                res.send('Animal Destroyed. Are you proud of yourself?')
            },
            function deleteError(err){
                res.send(500, err.message)
            }            
        );
});

// THIS WILL UPDATE AN EXISTING ANIMAL //

router.put('/update/:id', (req, res) => {
    
    let newAnimal = req.body.name;
    let newLegs = req.body.legNumber;
    let newPredator = req.body.predator;

    Animal
        .update({
            name: newAnimal,
            legNumber: newLegs,
            predator: newPredator
        },
        {where: {id: req.params.id}})
        .then(
            function updateSuccess(data) {
                res.json(data)
            },
            function updateError(err) {
                res.send(500, err.message)
            }
        )
})
module.exports = router;