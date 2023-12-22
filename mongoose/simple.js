const express = require("express");
const mongoose = require("mongoose");


const zod = require("zod");

const port = 3000;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/user-app")
.then(()=>{
    console.log('mongoose connected');
})
.catch(()=>{
    console.log('Error occured');
})

const User = mongoose.model('users', {email: String,
password: String });

function validateInput(users){
    const schema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    })

    const result = schema.safeParse(users);

    return result;
}

app.post('/signup', passMiddleware,  async (req, res) => {

    const userEmail = req.body.email;
    const userPass = req.body.password;

    const existingUser = await User.find({ email : userEmail });

    if(existingUser.length > 0){
        return res.status(400).send("Email already exists in the db");
    }

    const validation = validateInput(req.body);
    if(!validation.success){
        res.status(400).json({
            msg : 'Enter a valid email / password of 8 characters'
        })
        return;
    }

    const user = new User(
        {
         email: userEmail,
         password: userPass
        }
    );

    user.save();
    res.json({
        msg : "Successfully signed up!"
    })
})

app.delete('/users/:id', async(req, res) => {

});









app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
});

