var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
    /*const Calendar = () => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("FCSS");
            dbo.collection("Calendar").find().toArray(function(err1, res) {
                if (err1) throw err1;
                for (i = 0; i < res.length; i++) {
                    var s = res[i].Date.split('-')
                    var d = new Date(s[2] + '-' + s[1] + '-' + s[0] + "T12:00:00+05:30")
                    var line = {
                        'Date': d,
                        'W/H': res[i]['W/H'],
                        'Day': res[i]['Day'],
                        'Description': res[i].Description
                    }
                    dbo.collection("calendar").insertOne(line, function(err2, res) {
                        if (err2) throw err;
                        console.log('1 documnet inserted')

                    })
                }
                db.close();
            });
        });
    }
console.log(Calendar())*/
const insertUser = (user) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        dbo.collection("users").insertOne(user, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document inserted");
            db.close();
        });
    });
}
const findUser = (username, password, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: username, password: password }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const insertAdmin = (user) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        dbo.collection("Admin").insertOne(user, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document inserted");
            db.close();
        });
    });
}
const checkUser = (username, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: username }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const checkAdmin = (username, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: username }
        dbo.collection("Admin").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const findAdmin = (username, password, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: username, password: password }
        dbo.collection("Admin").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const getAdminId = (mail_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { mail_id: mail_id }
        dbo.collection("Admin").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const getUserId = (mail_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { mail_id: mail_id }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const updateAdminPass = (username, password) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, password: password } };
        dbo.collection("Admin").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}
const updateUserPass = (username, password) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, password: password } };
        dbo.collection("users").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}
const updateAdminToken = (username, token, profile) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, refreshToken: token, userProfile: profile } };
        dbo.collection("Admin").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}
const updateUserToken = (username, token, profile) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, refreshToken: token, userProfile: profile } };
        dbo.collection("users").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}
const getUserToken = (user_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: user_id }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res[0].refreshToken);
            db.close();
        });
    });
}
const getAdminToken = (user_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: user_id }
        dbo.collection("Admin").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res[0].refreshToken);
            db.close();
        });
    });
}
const addUserEvent = (username, event_obj) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("FCSS");
            var myquery = { user_id: username }
            var newvalues = { $push: { event: event_obj } };
            dbo.collection("users").updateOne(myquery, newvalues, function(err1, res) {
                if (err1) throw err1;
                console.log("1 document updated");
                db.close();
            });
        });
    }
const getUserEvent = (user_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: user_id }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res[0].event)
            callback(res[0].event);
            db.close();
        });
    });
}
    //---XX---
const getuserdetails = (username, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var query = { user_id: username }
        dbo.collection("users").find(query).toArray(function(err1, res) {
            if (err1) throw err1;
            console.log(res)
            callback(res);
            db.close();
        });
    });
}
const updateUserdetails = (username, mail_id, first_name, last_name, age, gender, phone_no, state, college) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, mail_id: mail_id, first_name: first_name, last_name: last_name, age: age, gender: gender, phone_no: phone_no, state: state, college: college } };
        dbo.collection("users").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
    });
}
const getusers = (room_id, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { room_id: room_id }
        dbo.collection("users").find(myquery).toArray(function(err1, res) {
            if (err1) throw err1;
            callback(res);
            db.close();
        });
    });
}
const addUserTimetable = (username,timetable,slot_timings) => {
        MongoClient.connect(url, function(err, db) {
           if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        var newvalues = { $set: { user_id: username, timetable:timetable,slot_timings:slot_timings } };
        dbo.collection("users").updateOne(myquery, newvalues, function(err1, res) {
            if (err1) throw err1;
            console.log("1 document updated");
            db.close();
        });
        });
    }
const getUserTimetable = (username, callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        var myquery = { user_id: username }
        dbo.collection("users").find(myquery).toArray(function(err1, res) {
            if (err1) throw err1;
            callback([res[0].timetable,res[0].slot_timings]);
            db.close();
        });
    });
}
const getCalendar=(callback) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("FCSS");
        dbo.collection("calendar").find().toArray(function(err1, res) {
            if (err1) throw err1;
            callback(res);
            db.close();
        });
    });
}
module.exports = {
    insertUser,
    findUser,
    insertAdmin,
    findAdmin,
    checkAdmin,
    checkUser,
    getAdminId,
    getUserId,
    updateAdminPass,
    updateUserPass,
    updateUserToken,
    updateAdminToken,
    getUserToken,
    getAdminToken,
    getuserdetails,
    updateUserdetails,
    getusers,
    addUserEvent,
    getUserEvent,
    addUserTimetable,
    getUserTimetable,
    getCalendar
};