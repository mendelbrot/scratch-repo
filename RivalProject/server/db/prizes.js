let db = null;

const tableName = 'prize';
const columns = ['name', 'value', 'quantity'];

const queries = {
    deleteAll: 'DELETE FROM prize WHERE id IN (?)'
};

module.exports = Object.assign(require('./crudBase').create(tableName, columns), {
    init(database) {
        if(!db) {
            db = database;
        }
    },
    deleteAll(ids, callback) {
        if(!ids.length)
            callback(null, 0);
        else {
            db.onReady = () => db.connection.query(queries.deleteAll, [ids], (err, res) => {
                callback(err, err ? null : res.affectedRows);
            });
        }
    }
});