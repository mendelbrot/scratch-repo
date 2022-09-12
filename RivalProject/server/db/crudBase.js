let db = null;

module.exports = {
    create(tableName, columns, config = {}) {
        const mapWrite = config.mapWrite;
        const mapRead = config.mapRead;
        const primary = config.primary || 'id';
        const queries = {
            getAll: 'SELECT * FROM ' + tableName,
            get: 'SELECT * FROM ' + tableName + ' WHERE ' + primary + '=?',
            add: 'INSERT INTO ' + tableName + ' (' + columns.join(',') + ') '
                + 'VALUES (' + columns.map(() => '?').join(',') + ')',
            update: entry => {
                let query = 'UPDATE ' + tableName + ' SET ';
                let first = true;
                for(let col of Object.getOwnPropertyNames(entry)) {
                    if(col === primary)
                        continue;
                    if(!first)
                        query += ',';
                    query += col + '=?';
                    first = false;
                }
                query += ' WHERE ' + primary + '=?';
                return query;
            },
            replace: 'REPLACE INTO ' + tableName + ' (' + columns.join(',') + ') '
                    + 'VALUES (' + columns.map(() => '?').join(',') + ')',
            delete: 'DELETE FROM ' + tableName + ' WHERE ' + primary + '=?',
        };

        return {
            getAll(callback, config = {}) {
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.getAll, (err, res) => {
                        res = err ? [] : res;
                        res = mapRead ? res.map(row => mapRead(row)) : res;
                        callback(err, res);
                    });
            },
            get(id, callback, config = {}) {
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.get, id, (err, res) => {
                        res = err || !res[0] ? null : res[0];
                        res = res && mapRead ? mapRead(res) : res;
                        callback(err, res);
                    });
            },
            add(entry, callback, config = {}) {
                try { entry = mapWrite ? mapWrite(entry) : entry; }
                catch(err) { callback(err, null); return; }
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.add, toArray(entry), (err, res) => {
                        callback(err, err ? 0 : res.insertId || entry[primary] || true);
                    });
            },
            update(entry, callback, config = {}) {
                const id = entry[primary];
                try {
                    entry = mapWrite ? mapWrite(entry) : entry;
                    entry[primary] = id;
                    entry = removeUnused(entry);
                } catch(err) { callback(err, null); return; }
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.update(entry), toArray(entry, true), (err, res) => {
                        callback(err, !err && res.affectedRows > 0 ? res.insertId || entry[primary] || true : 0);
                    });
            },
            replace(entry, callback, config = {}) {
                try { entry = mapWrite ? mapWrite(entry) : entry; }
                catch(err) { callback(err, null); return; }
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.replace, toArray(entry), (err, res) => {
                        callback(err, !err && res.affectedRows > 0 ? res.insertId || entry[primary] || true : 0);
                    });
            },
            delete(id, callback, config = {}) {
                db[config.onState === 1 ? 'onCreatedTables' : 'onReady'] =
                    () => db.connection.query(queries.delete, id, (err, res) => {
                        callback(err, err ? false : res.affectedRows > 0);
                    });
            }
        };
    
        function toArray(entry, trim = false) {
            if(trim) {
                let arr = [];
                let includedPrimary = false;
                for(let col of columns) {
                    if(entry[col] !== undefined)
                        arr.push(entry[col]);
                    if(col === primary)
                        includedPrimary = true;
                }
                if(!includedPrimary)
                    arr.push(entry[primary]);
                return arr;
            }
            return columns.map(col => entry[col]);
        }
        function removeUnused(entry) {
            if(!entry[primary])
                throw new Error('Primary key required');

            let trimmed = {};
            for(let col of columns) {
                if(entry[col] !== undefined && col !== primary)
                    trimmed[col] = entry[col];
            }
            trimmed[primary] = entry[primary];
            return trimmed;
        }
    },
    init(database) {
        if(!db)
            db = database;
    }
}