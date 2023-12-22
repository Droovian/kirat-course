const express = require("express");
const port = 3000;

const app = express();

function checkEarnings(req, res, next){
    let earning = req.query.earning;

    if(earning < 10000){
        res.status(403).json({
            msg : 'Earn more',
        });
    }
    else{
        next();
    }
}

function userMiddleware(req, res, next){
    let username = req.headers.username;
    let password = req.headers.password;

    if(username != 'Dhruv' || password != 'pass'){
        res.status(403).json({
            msg : 'Invalid input',
        });
    }
    else{
        next();
    }
};

app.get('/health-checkup', userMiddleware, checkEarnings, function(req, res, next){
    res.send('All healthy');

});


app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
});
