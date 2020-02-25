var express = require("express")
var app = express()
var db = require("./database.js")
const https = require('https');


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000;

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/customers", (req, res, next) => {
  var sql = "select * from customer"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});


app.get("/api/customer/:id", (req, res, next) => {
  var sql = "select * from customer where id = ?";
  var params =req.params.id;
  console.log(params)
  db.get(sql, [params], (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    console.log(params + row);
    res.json({
      "message":"success",
      "data":row
    })
  });
});


app.post("/api/customer/", (req, res, next) => {
  var errors=[]
  if (!req.body.password){
    errors.push("No password specified");
  }
  if (!req.body.email){
    errors.push("No email specified");
  }
  if (errors.length){
    res.status(400).json({"error":errors.join(",")});
    return;
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password : req.body.password
  }
  var sql ='INSERT INTO customer (name, email, password) VALUES (?, ?, ?)'
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
    if (err){
      res.status(400).json({"error": err.message})
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id" : this.lastID
    })
  });
})



app.put("/api/customer/:id", (req, res, next) => {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password : req.body.password ? req.body.password: undefined
  }
  db.run(
    `UPDATE customer set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    (err, result) => {
      if (err){
        res.status(400).json({"error": res.message})
        return;
      }
      res.json({
        message: "success",
        data: data
      })
    });
})


app.delete("/api/customer/:id", (req, res, next) => {
  db.run(
    'DELETE FROM customer where id = ?',
    req.params.id,
    function (err, result) {
      if (err){
        res.status(400).json({"error": res.message})
        return;
      }
      res.json({"message":"deleted", rows: this.changes})
    });
})




// root path
app.get("/", (req, res, next) => {
  res.json({"message":"ok"})
});