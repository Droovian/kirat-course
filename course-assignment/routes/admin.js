const express = require('express');
const { Admin } = require('../db');

const port = 3000;

const app = express();

app.use(express.json());

async function adminMiddleware(req, res, next) {

    const adminUsername = req.headers['username'];
    const adminPass = req.headers['password'];

    const adminExistence = await Admin.findOne({ adminUsername, adminPass });

    if(!adminExistence){
        return res.status(404).json({
            errorMsg : 'Invalid details'
        });
    }

    next();

}

app.post('/signup', (req, res)=>{

    Admin.create({
        username: req.body.username,
        password: req.body.password
    });

    res.json({
        msg: 'Admin created successfully'
    })

});

app.post('/courses', adminMiddleware, (req, res) => {

    Course
    .create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image
    });
    
});

app.get('/courses', adminMiddleware, (req, res) => {

    Course
        .find().then(courses => { res.json(courses); })
});
