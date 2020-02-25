var sqlite3 = require('sqlite3').verbose()


let db = new sqlite3.Database('mydb.db', (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }else{
    console.log('Connected to the SQlite database.')
    db.run(`CREATE TABLE customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,(err) => {
      if (err) {
          console.log("table already created");

      }else{

        var insert = 'INSERT INTO customer (name, email, password) VALUES (?,?,?)'
        db.run(insert, ["Owner","owner@store.com", "ownerpass123"])
        db.run(insert, ["john","john@store.com", "johnstore"])
        db.run(insert, ["pal","pal@store.com", "palstore"])
        db.run(insert, ["tina","tina@store.com", "tinastore"])
        db.run(insert, ["henry","henry@store.com", "henrystore"])

      }
    })
  }
})


module.exports = db