const tableName = 'image';
const columns = ['filename', 'width', 'height'];
const urljoin = require('url-join');

module.exports = require('./crudBase').create(tableName, columns, {
    mapRead: image => Object.assign(image, {
        path: urljoin(process.env.BASE_URL, 'uploads/' + image.filename)
    })
});