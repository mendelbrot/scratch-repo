const auth = require('..');
const jwt = require('jsonwebtoken');

module.exports = function ensureLoggedIn(req, res, next) {
    let token = req.headers.authorization;
    if(!token) {
        res.status(403).send('Not logged in');
        return;
    }
    if(!token.startsWith('Bearer ')) {
        res.status(403).send('Not logged in');
        return;
    }
    token = token.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if(1000 * decoded.exp < Date.now()) {
            res.status(403).send('Not logged in');
        } else {
            res.jwtUser = decoded.username;
            res.jwtToken = auth.issueToken(decoded.username);
            next();
        }
    } catch(err) {
        console.log(err);
        res.status(403).send('Not logged in');
    }
}