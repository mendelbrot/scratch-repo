const sharp = require('sharp');
const fnHelper = require('../../io/filename-helper');
const mkdirp = require('mkdirp');
const fs = require('fs');
const db = require('../../db');
const path = require('path');
const urljoin = require('url-join');
const uploadUrl = 'uploads/';

const width = 300;
const height = 300;

module.exports = {
    // get
    getAll: (req, res, next) => {
        db.connect(err => {
            if(err) return handleErr(err, res, 500);
            db.images.getAll((err, images) => {
                if(err)
                    return handleErr(err, res, 500);
                res.json({
                    token: res.jwtToken,
                    data: images
                });
                db.disconnect();
            });
        });
    },
    // get
    get: (req, res, next) => {
        const id = +req.params.id;
        if(!(id > 0))
            return handleErr(null, res, 404);
        db.connect(err => {
            if(err) return handleErr(err, res, 500);
            db.images.get(id, (err, image) => {
                if(err)
                    return handleErr(err, res, 500);
                if(!image)
                    return handleErr(null, res, 404);
                res.json({
                    token: res.jwtToken,
                    data: image
                });
                db.disconnect();
            });
        });
    },
    // post
    post: (req, res, next) => {
        const tempPath = req.file.path;
        if(!/^image\b/.test(req.file.mimetype)) {
            fs.unlink(tempPath, handleErr);
            res.status(400).send('Not an image!');
        } else {
            const image = sharp(tempPath);
            image.metadata().then(metadata => {

                const dir = path.join(__dirname, '../../..', uploadUrl);
                const filename = fnHelper.ensureUnique(dir,
                    req.file.originalname,
                    metadata.format);

                mkdirp(dir, err => {
                    if(err) {
                        fs.unlink(tempPath, handleErr);
                        return handleErr(err, res, 500);
                    }
                    image.resize(width, height).toFile(dir + filename, (err, savedImg) => {
                        fs.unlink(tempPath, handleErr);
                        if(err)
                            return handleErr(err, res, 500);
                        const jsonImage = {
                            filename: filename,
                            width: savedImg.width,
                            height: savedImg.height
                        };
                        
                        db.connect(err => {
                            if(err) return handleErr(err, res, 500);
                            db.images.add(jsonImage, (err, id) => {
                                if(err)
                                    return handleErr(err, res, 500);
                                jsonImage.path = urljoin(process.env.BASE_URL, uploadUrl, filename);
                                jsonImage.id = id

                                // Success
                                res.json({
                                    token: res.jwtToken,
                                    data: jsonImage
                                });
                                db.disconnect();
                            });
                        });
                    });
                });
            }).catch(err =>
                handleErr(err, res, 400, 'Invalid or corrupt image file')
            );
        }
    },
    // delete
    delete: (req, res, next) => {



        const id = +req.params.id;
        console.log(req.params.id);
        if (!(id > 0))
            return handleErr(null, res, 404);

        // Get image details
        db.connect(err => {
            if (err) return handleErr(err, res, 500);
            db.images.get(id, (err, image) => {
                if (err)
                    return handleErr(err, res, 500);
                if (!image)
                    return handleErr(null, res, 404);

                // Delete image from db
                db.images.delete(id, (err, success) => {
                    if (err)
                        return handleErr(err, res, 409, 'Image in use!');

                    // Delete image file
                    const filepath = path.join(__dirname, '../../..', uploadUrl, image.filename);
                    fs.unlink(filepath, err => {
                        if (err)
                            return handleErr(err, res, 500);
                    })
                    res.json({
                        token: res.jwtToken,
                        data: { id: id, deleted: success }
                    });
                    db.disconnect();
                });
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