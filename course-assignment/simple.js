const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/sum', async (req, res) => {

    const principal = parseInt(req.query.p);
    const rate = parseInt(req.query.r);
    const time = parseInt(req.query.t);

    const si = (principal * rate * time) / 100;
    const total = principal + si;

    res.json({
        interest: si,
        totalPrincipal: total
    });


});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})