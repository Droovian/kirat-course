/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module
  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
    - For any other route not defined in the server return 404
    Testing the server - run `npm run test-fileServer` command in terminal
 */
    const express = require("express");
    const fs = require('fs');
    const path = require('path');
    const port = 3000;
    const app = express();
    
    app.use(express.json());
    
    const pathToDirectory = './files';
    
    
    const data = fs.readdirSync(pathToDirectory);
    
    app.get("/files", (req, res)=>{
        res.status(200).json(data);
    });
    
    app.get("/files/:id", (req, res)=> {
    
      const fileName = req.params.id;
        
      const filePath = path.join(pathToDirectory, fileName);
        
        if(filePath){
        fs.readFile(filePath, "utf-8", (err, data)=>{

            if(err){
                res.status(404).send("File not found!");
            }
            let filesData = data;

            res.json(filesData);
        })
        }
        else{
            res.json({"msg" : "File not found"});
        }
    })
    
    app.all('*', (req, res)=>{
        res.status(404).send("<h1>Invalid Route!</h1>");
    });

    app.listen(port, ()=>{
        console.log(`server active on port ${port}`);
    });

    module.exports = app;