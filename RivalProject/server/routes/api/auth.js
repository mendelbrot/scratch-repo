const auth = require('../../auth/index');
const db = require('../../db');

module.exports = {
    post: (req, res, next) => {
        const user = {
            username: req.body.username,
            password: req.body.password
        }

        function sendToken(token) {
            res.json({ "token": token })
        }
        function userVerified(err, username) {
            if (username === false) {
                if(err)
                    console.log(err);
                console.log("Incorrect username/password");
                res.json({ "status": 403 })
            } else {
                console.log(username);
                //issue token
                const token = auth.issueToken(username);
                sendToken(token);
                db.disconnect();
            }
        }
        db.connect(err => {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            auth.verifyUser(user, userVerified)
        });
    },
    add: (req,res,next) => {
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        function confirmAdd(){
            res.json({
                token: res.jwtToken,
                data: {
                    username: req.body.username,
                    success: true
                }
            });
        }
        function successAdd(err, res) {
            if (!res){
                if(err)
                    console.log(err);
                console.log("unable to add User!");
            } else {
                console.log(res);
                confirmAdd();
            }
        }

        db.connect(err => {
            if(err) {
                console.log(err);
                return res.status(500).send();
            }
            auth.addUser(user, successAdd);
            db.disconnect();
        });
    }
};