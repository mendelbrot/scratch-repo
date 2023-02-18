const db = require('../../db');

module.exports = {
    getDemo: (req, res) => {
        db.connect(err => {
            if(err) return handleErr(err, res, 500);
            db.cardResults.getRandom(req.params.campaignId, (err, result) => {
                if(err || !result)
                    return handleErr(err, res, 500);
                res.json({data: result});
                db.disconnect();
            });
        });
    }
};

function handleErr(err, res, status, message) {
    if(err)
        console.log(err);
    if(res)
        res.status(status).send(message);
}