const tableName = 'overlay';
const columns = ['title',
    'image',
    'size'
];

let db = null;

module.exports = Object.assign(require('./crudBase').create(tableName, columns, {
    mapRead: mapRead,
    mapWrite: mapWrite
}), {
        init(database) {
            if (!db)
                db = database;
        },
        getDetail(id, callback) {
            db.overlays.get(id, (err, overlay) => {
                if (err || !overlay) {
                    callback(err, null);
                } else if(!overlay.image) {
                    callback(null, overlay);
                } else {
                    db.images.get(overlay.image, (err, image) => {
                        overlay.image = image;
                        callback(err, err || !image ? null : overlay);
                    });
                }
            });
        }
    });

function mapRead(template) {
    return {
        id: template.id,
        title: template.title,
        image: template.image,
        size: template.size
    };
}
function mapWrite(template) {
    return {
        id: template.id,
        title: template.title,
        image: template.image,
        size: template.size
    };
}