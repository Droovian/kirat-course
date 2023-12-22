const express = require("express");
const port = 3000;

const app = express();

let counter = 0;

function countRequests(req, res, next){

    counter++;  
    console.log(counter);

    next();
}

app.use(countRequests);

app.get('/', (req, res)=>{
    res.send("Yooooo");
});

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
});

