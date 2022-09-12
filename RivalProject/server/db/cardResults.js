const urljoin = require('url-join');

let db = null;

const tableName = 'card_result';
const columns = ['title', 'image', 'campaign', 'prize'];

const queries = {
    getDetailAll: 'SELECT r.*, p.name, p.value, p.quantity, p.id as prize_id, i.filename, i.width, i.height, i.id as image_id FROM card_result r LEFT JOIN prize p ON prize=p.id LEFT JOIN image i ON image=i.id WHERE campaign=?',
    deleteAll: 'DELETE FROM card_result WHERE campaign=?'
};

module.exports = Object.assign(require('./crudBase').create(tableName, columns), {
    init(database) {
        if(!db) {
            db = database;
        }
    },
    getDetailAll(campaignId, callback) {
        db.onReady = () => db.connection.query(queries.getDetailAll, campaignId, (err, res) => {
            res = err ? [] : res;
            res = res.map(cardResult => {
                if(cardResult.prize) {
                    cardResult.prize = {
                        id: cardResult.prize_id,
                        name: cardResult.name,
                        value: cardResult.value,
                        quantity: cardResult.quantity
                    };
                }
                if(cardResult.image) {
                    cardResult.image = {
                        id: cardResult.image_id,
                        filename: cardResult.filename,
                        path: urljoin(process.env.BASE_URL, 'uploads/', cardResult.filename),
                        width: cardResult.width,
                        height: cardResult.height
                    };
                }
                delete cardResult.prize_id;
                delete cardResult.name;
                delete cardResult.value;
                delete cardResult.quantity;
                delete cardResult.image_id;
                delete cardResult.filename;
                delete cardResult.width;
                delete cardResult.height;
                return cardResult;
            })
            callback(err, res);
        });
    },
    getRandom(campaignId, callback) {
        db.campaigns.getDetail(campaignId, (err, campaign) => {
            if(err || !campaign)
                callback(err, null);
            else {
                const est = campaign.estimatedParticipants || Infinity;
                const prizeRes = [];
                const nonPrizeRes = [];
                let prizeCount = 0;
                campaign.cardResults.forEach(res => {
                    if(res.prize) {
                        prizeRes.push(res);
                        prizeCount += res.prize.quantity;
                    } else {
                        nonPrizeRes.push(res);
                    }
                })
                const win = prizeCount/est > Math.random();
                if(win) { // Win

                    let prizeNo = (prizeCount * Math.random()) | 0;
                    for(let i = 0; i < prizeRes.length; i++) {
                        prizeNo -= prizeRes[i].prize.quantity;
                        if(prizeNo < 0) {
                            callback(null, compose(campaign, prizeRes[i]));
                            break;
                        }
                    }
                } else { // Lose

                    if(!nonPrizeRes.length)
                        callback('No non-prizes exist!', null);
                    else {
                        const res = nonPrizeRes[(nonPrizeRes.length * Math.random()) | 0];
                        callback(null, compose(campaign, res));
                    }
                }
            }
        });
        function compose(campaign, result) {
            result.hasWon = !!result.prize
            const data = {
                name: campaign.name,
                template: campaign.template,
                result: result
            };
            delete data.template.id;
            delete data.template.image.id;
            delete data.result.id;
            delete data.result.image.id;
            delete data.result.campaign;
            return data;
        }
    },
    addDetail(entry, callback) {
        if(entry.prize) {
            db.prizes.add(entry.prize, addResult);
        } else {
            addResult(null, 0);
        }
        function addResult(err, prizeId) {
            if(err) callback(err, null);
            else {
                if(prizeId)
                    entry.prize = prizeId;
                db.cardResults.add(entry, callback);
            }
        }
    },
    addDetailAll(campaignId, entries, callback) {
        let count = 0;
        let fails = 0;
        let firstErr = null;
        entries.forEach(cardRes => {
            cardRes.campaign = campaignId;
            db.cardResults.addDetail(cardRes, multiCallback);
        });
        function multiCallback(err) {
            count++
            if(err) {
                fails++
                if(!firstErr)
                    firstErr = err;
            }
            if(count >= entries.length) {
                callback(firstErr, {
                    count: count,
                    fails: fails,
                    successes: count - fails
                });
            }
        }
    },
    deleteDetailAll(campaignId, callback) {
        db.cardResults.getDetailAll(campaignId, (err, results) => {
            if(err || !results) callback(err, null);
            else {
                prizeIds = [];
                results.forEach(res => {
                    if(res.prize)
                        prizeIds.push(res.prize.id);
                });
                db.onReady = () => db.connection.query(queries.deleteAll, campaignId, (err, res) => {
                    if(err) callback(err, null);
                    else {
                        db.prizes.deleteAll(prizeIds, err => {
                            callback(err, err ? null : res.affectedRows);
                        });
                    }
                });
            }
        });
    },
    replaceDetailAll(campaignId, entries, callback) {
        db.cardResults.deleteDetailAll(campaignId, err => {
            if(err) callback(err, null);
            else {
                db.cardResults.addDetailAll(campaignId, entries, callback);
            }
        });
    }
});