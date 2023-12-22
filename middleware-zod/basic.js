// ugly version without middlewares

const express = require("express");
const port = 3000;

const app = express();

app.get('/health-checkup', function(req, res){
    const kidneyId = req.query.kidneyId;
    const username = req.headers.username;
    const password = req.headers.password;

    if(username != 'Droov' && password != 'pass'){
        res.status(403).json({
            msg : 'User doesnt exist',
        });

        return;
    }

    if(kidneyId != 1 && kidneyId != 2){
        res.status(411).json({
            msg : 'wrong input bozo',
        });

        return;
    }

    res.send('all good & healthy');
});

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})