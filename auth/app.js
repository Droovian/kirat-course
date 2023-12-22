const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
const port = 3000;

const app = express();

app.use(express.json());

const ALL_USERS = [
  {
    username: "dhruvnaik21@gmail.com",
    password: "123",
    name: "Dhruv Naik",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
    const checkUser = ALL_USERS.find((user)=> user.username === username && user.password === password);
    return checkUser ? true : false;

}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, "jwtPassword");
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
    const token = req.headers.authorization;
    try {
      console.log("Received token:", token); // Log the received token
      const decoded = jwt.verify(token, "jwtPassword");
      console.log("Decoded token:", decoded); // Log the decoded token
      const username = decoded.username;
      // return a list of users other than this username
    } catch (err) {
      console.error("Error verifying token:", err); // Log any errors
      return res.status(403).json({
        msg: "Invalid token",
      });
    }
  });
  

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})