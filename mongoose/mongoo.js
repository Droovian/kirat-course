const express = require('express');
const mongoose = require('mongoose');
const { generateId, validateInput, generateCourseId } = require('./userid');
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

const courseSchema = mongoose.Schema({

    CourseId : String,
    courseName : String,
    description: String,
    price: Number

});

mongoose.connect(`mongodb://localhost:${mongoPort}/mongousers`).then(()=>{console.log(`connected to mongoose`);})

const User = mongoose.model('users', mongoSchema);
const Course = mongoose.model('courses', courseSchema);

app.use(express.json());

async function passwordMiddleware(req, res, next){

    const passwordToHash = req.body.password;
    
    const hashed = await bcrypt.hash(passwordToHash, saltRounds);

    req.hashedPassword = hashed;

    next();
}

app.get('/courses/:id', async (req, res) => {

    const courseId = req.params.id;

    try{
        const course = await Course.findOne({ CourseId : courseId });

        if(!course){
            return res.status(404).json({
                msg : 'Course not found'
            });
        }

        res.status(200).json(course);
    }
    catch(err){
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

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

app.post('/courses', async (req, res) => {

    const courseId = generateCourseId();
    const { courseName, description, price } = req.body;

    const checkDup = await Course.find({ courseName, courseId });

    if(checkDup.length > 0){
        return res.status(404).json({
            msg : 'Course has been created already!'
        });
    }

    const newCourse = new Course({
        CourseId: courseId,
        courseName : courseName,
        description : description,
        price: price
    });

    try{
        await newCourse.save();
        res.json({
            msg: 'Course created successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }

});

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});

