let express = require("express");
let app = express();
const bodyParser = require("body-parser");
let mysql = require("mysql");
let connData = {
    host:"localhost",
    user : "root",
    password:"",
    database:"questions"
};

app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONs, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Request-With,Content-Type,Access"
    );
    next();

});
const port=2410;
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));

/// Inserting the data into the data base

let connection=mysql.createConnection(connData);
app.post("/question", function(req,res){
    let quesNum = req.body.id;
    let image = req.body.image;
    let answer = req.body.answer;
    let sql = "INSERT INTO questiondata(id,image,answer) VALUES(?,?,?)";
    connection.query(sql,[quesNum,image,answer], function(err,result){
        if(err) console.log("Error in database",err.message);
        else res.send(result)
    });
});


// Get all the question from tyhe database

app.get("/question",function(req,res){
    let sql = "SELECT * FROM questiondata";
    connection.query(sql,function(err, data){
        if(err) console.log("Error in database",err.message);
        else res.send(data);
    })
});


// feacthing the result to the database
let connData2 = {
    host:"localhost",
    user : "root",
    password:"",
    database:"showresult"
};
app.get(bodyParser.urlencoded({extended:true}));


app.post("/results",(req,res) =>{
    //  let name = req.body.name;
    let countError = req.body.countError;
    let date = req.body.date;
    let time = req.body.time;

    let connection=mysql.createConnection(connData2); 
    let sql = "INSERT INTO result(errorCount,date,time) VALUES(?,?,?);"
    connection.query(sql,[countError,date,time],function(err,result){
        if(err) console.log("Error in database",err.message);
        else res.send(result);  
    });
});