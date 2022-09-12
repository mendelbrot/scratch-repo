const db = require('..');
const auth = require('../../auth');

const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

if(adminUser === undefined)
    throw new ReferenceError("Couldn't find ADMIN_USER environment variable");
if(adminPass === undefined)
    throw new ReferenceError("Couldn't find ADMIN_PASS environment variable");

// -- Create admin --

module.exports = callback => {
    db.users.get(adminUser, (err, user) => {
        if(err) throw err;

        if(!user) {
            auth.addUser({
                username: adminUser,
                password: adminPass
            }, assignAdmin, { onState: 1});
        } else if(!user.isAdmin) {
            assignAdmin();
        } else {
            console.log("Created admin");
            callback();
        }
    }, { onState: 1 });

    function assignAdmin(err) {
        if(err) throw err;

        // Assign as admin
        db.admin.assign(adminUser, err => {
            if(err) throw err;

            // Success
            console.log("Created admin");
            callback();
        }, { onState: 1 });
    }
}