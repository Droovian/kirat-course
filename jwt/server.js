require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        username : 'Dhruv',
        title : 'post 1'
    },
    {
        username : 'Jim',
        title: 'post 2'
    }
];

app.get('/posts', authenticateToken, (req, res)=>{
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post('/login', (req, res)=>{

    const username = req.body.username;
    const user = { name : username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken : accessToken });

});

function authenticateToken(req, res, next){
    const authHeader = req.headers['Authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        res.status(401).json({
            msg : 'Invalid token'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(403).json({
            msg : 'Problem'
        })

        req.user = user
        next();
    })

}

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})