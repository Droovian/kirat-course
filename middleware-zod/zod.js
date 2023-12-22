const zod = require("zod");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());
function validateInput(obj){
    const schema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    })

    const response = schema.safeParse(obj);
    console.log(response);

    return response;
}


app.post('/login', (req, res)=>{
    const response = validateInput(req.body);

    console.log(response);
    if(!response.success){
        res.json({
            msg : "invalid inputs"
        })
        return;
    }
});


app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
})