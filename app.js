const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { check, validationResult } = require('express-validator/check');
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
let ObjectId = mongojs.ObjectId;

let app = express();

/*let logger = function(req, res, next){
    console.log('Logging...');
    next();
};

app.use(logger);
*/

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static Path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    db.users.find(function (err, docs) {
        // docs is an array of all the documents in mycollection
        console.log(docs);
        res.render('index', {
            title: 'Customers', 
            users: docs
        });
    })
    
    //res.json(people);
});

app.post('/users/add', [
    check('first_name').isLength({min: 1}),
    check('last_name').isLength({min: 1}),
    check('email').isEmail()
    ],function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
        }
        
        db.users.insert(newUser,function(err,result){
            if(err){
                console.log(err);
            }
        });
        console.log(newUser);
        res.redirect('/');
});

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id:ObjectId(req.params.id)},function(err, result){
        if(err){
            console.log(err);
        }
    })
});

app.listen(3000,function(){
    console.log('Server started on port 3000...');
})