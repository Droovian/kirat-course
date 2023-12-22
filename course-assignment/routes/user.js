const express = require('express');
const { User } = require('../db');

const app = express();

app.post('/signup', async (req, res)=>{

    const username = req.body.username;
    const pass = req.body.pass;

    const checkExistence = await User.findOne({username, pass});

    if(checkExistence){
        res.status(404).json({
            msg : 'User already exists! Try logging in'
        })
    }
    else{
        const user = new User({
            username : username,
            password : pass
        })

        await user.save();
        res.status(200).json({
            msg : 'User signup successfull!'
        })
    }
});


