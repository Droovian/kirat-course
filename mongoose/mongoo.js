const express = require('express');
const mongoose = require('mongoose');
const { generateId, validateInput } = require('./userid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const zod = require('zod');

const port = 3000;
const mongoPort = 27017;

const app = express();

const mongoSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String
});

mongoose.connect(`mongodb://localhost:${mongoPort}/mongousers`).then(()=>{console.log(`connected to mongoose`);})

const User = mongoose.model('users', mongoSchema);

app.use(express.json());

async function passwordMiddleware(req, res, next){

    const passwordToHash = req.body.password;
    
    const hashed = await bcrypt.hash(passwordToHash, saltRounds);

    req.hashedPassword = hashed;

    next();
}

app.post('/signup', passwordMiddleware, async(req, res) => {

    const id = generateId();
    const name = req.body.name;
    const email = req.body.email;
    const password = req.hashedPassword;

    const checkIfExists = await(User.find({ email }));

    if(checkIfExists.length > 0){
        return res.status(404).json({
            msg : 'User already exists, please try logging in'
        });
    }
    
    const validation = validateInput(req.body);
    if (!validation.success) {
        res.status(400).json({
            msg: 'Enter a valid email / password of 8 characters'
        });
        return;
    }

    const user = new User({
        id: id,
        name: name,
        email: email,
        password: password
    });

    user.save();

    res.json({
        msg: 'Sign-up was successful! Kudoz'
    });


});

app.post('/login', async(req, res) => {

    const { email, password } = req.body;

    try{
        const user = await User.findOne({email});
        const db_pass = user.password;
        if(!user){
            return res.status(401).json({
                msg : 'Invalid email or password'
            });
        }

        const checkPass = await bcrypt.compare(password, db_pass);

        if(checkPass){
            return res.status(200).json({
                msg : 'Login Successful'
            })
        }
        else{
            return res.status(401).json({
                msg : 'Invalid password'
            })
        }
    }
    catch(err){
        console.log('Error occured while logging in');

        res.status(500).json({
            msg : 'Internal server error'
        });
    }
});

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});

