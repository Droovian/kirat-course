const express = require("express");
const zod = require("zod");

const port = 3000;

const app = express();

const schema = zod.array(zod.number());



/*
    {
        email : string => email,
        password: atleast 8 letters,
        country: "IN", "US"
    }

*/

const zodSchema = zod.object({
    email: zod.string(),
    password: z.string(),
    country: z.literal("IN").or(z.literal("US")),
    kidneys: z.array(z.number())
});


app.use(express.json());

app.post('/health-checkup', function(req, res){

    const kidneys = req.body.kidneys;
    const response = schema.safeParse(kidneys);
    // const kidneyLength = kidneys.length;
    if(!response.success){
        res.status(411).json({
            msg : 'input is invalid',
        });
    }
    else{
    res.send(response);
    }

});
// global catches

// app.use(function(err, req, res, next){
//     res.status(500).json({
//         msg: 'Sorry something is up with our server'
//     })
// });


app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
});

