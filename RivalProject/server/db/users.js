const tableName = 'login_user';
const columns = ['username', 'password_hash', 'is_admin'];

module.exports = require('./crudBase').create(tableName, columns, {
    mapWrite: mapWrite,
    mapRead: mapRead,
    primary: 'username'
});

function mapWrite(user) {
    return {
        username: user.username,
        password_hash: user.passwordHash,
        is_admin: 0
    };
}
function mapRead(user) {
    return {
        username: user.username,
        passwordHash: user.password_hash,
        isAdmin: !!user.is_admin
    };
}