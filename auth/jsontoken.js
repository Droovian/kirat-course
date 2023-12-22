const jwt = require("jsonwebtoken");
const express = require("express");
const port = 3000;

const app = express();


const contents = {
    name : 'Dhruv',
    accountNo : 123456789
}

const token = jwt.sign(contents, "secretpass");

app.get('/', (req, res)=>{
    console.log(token);
})
app.listen(port, ()=>{
    console.log(`serve listening on port ${port}`);
})