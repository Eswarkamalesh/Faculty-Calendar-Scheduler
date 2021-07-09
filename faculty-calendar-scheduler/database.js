var url = "mongodb://localhost:27017/FCSS";
var MongoClient = require('mongodb').MongoClient
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("FCSS");
    dbo.createCollection("admin", function(err1, res) {
        if (err1) throw err1;
        console.log("Collection created!");
        db.close();
    });
});
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("FCSS");
    dbo.createCollection("users", function(err1, res) {
        if (err1) throw err1;
        console.log("Collection created!");
        db.close();
    });
});