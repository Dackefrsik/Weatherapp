const express = require("express");
const jsdom = require("jsdom");
const fs = require("fs");

const app = express();

const http = require("http").createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use("/public", express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/html/index.html", (error, date) => {
        if(error){
            console.log(error.message);
            res.write("Error 404: File not found");
        }
        else{
            res.end(JSON.stringify(date));
        }
    });
});

const server = http.listen(3000, function(){
    console.log("App is listening on port 3000");
});