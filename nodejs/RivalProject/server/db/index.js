const mysql = require('mysql');
const env = process.env;
const queue1 = []; // On created tables
const queue2 = []; // On ready
const states = {
    CREATED_TABLES: 1,
    READY: 2
};
let state = 0;
let connection = null;
let tasks = 0;

const crudBase = require('./crudBase');

const connectionValues = env.NODE_ENV == 'development' ?
    {
        host: env.DB_HOST !== undefined ? env.DB_HOST : 'localhost',
        user: env.DB_USER !== undefined ? env.DB_USER : 'user',
        password: env.DB_PASS !== undefined ? env.DB_PASS : 'password',
        database: env.DB_NAME !== undefined ? env.DB_NAME : 'database'
    } : env.CLEARDB_DATABASE_URL; 

const db = {
    get connection() { return connection; },
    connect(callback) {
        tasks++;
        if(connection) {
            callback();
        } else {
            console.log('Connect db...');
            connection = mysql.createConnection(connectionValues);
            connection.connect(err => {
                callback(err);
            });
        }
    },
    disconnect(callback = null) {
        if(tasks > 0) {
            tasks--;
            if(tasks > 0) {
                if(callback) callback();
            } else {
                console.log('Disconnect db...')
                connection.end(err => {
                    if(callback)
                        callback(err);
                    else if(err)
                        console.log(err);
                });
                connection = null;
            }
        }
    },

    get state() { return state; },
    set onCreatedTables(func) {
        if(typeof func !== 'function')
            throw TypeError('Function expected');

        if(state >= states.CREATED_TABLES)
            func();
        else
            queue1.push(func);
    },
    set onReady(func) {
        if(typeof func !== 'function')
            throw TypeError('Function expected');

        if(state >= states.READY)
            func();
        else
            queue2.push(func);
    },

    admin:       require('./admin'),
    campaigns:   require('./campaigns'),
    cardResults: require('./cardResults'),
    images:      require('./images'),
    prizes:      require('./prizes'),
    users:       require('./users'),
    overlays:    require('./overlays')
};

crudBase.init(db);
for(prop of Object.getOwnPropertyNames(db)) {
    if(db[prop] && db[prop].init)
        db[prop].init(db);
}

module.exports = db;

db.connect(err => {
    if(err)
        return console.log(err);
    require('./create/tables')(connection, function() {
        state = states.CREATED_TABLES;
        console.log("Created tables");
        for(var callback of queue1)
            callback();
        require('./create/admin')(function() {
            state = states.READY;
            console.log("Database ready");
            for(var callback of queue2)
                callback();
            db.disconnect();
        });
    });
});