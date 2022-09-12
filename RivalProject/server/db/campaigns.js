const tableName = 'campaign';
const columns = [ 'name',
                  'template',
                  'is_active',
                  'created_by',
                  'created_at',
                  'estimated_participants',
                  'url' ];

let db = null;

module.exports = Object.assign(require('./crudBase').create(tableName, columns, {
    mapRead: mapRead,
    mapWrite: mapWrite
}), {
    init(database) {
        if(!db) {
            db = database;
        }
    },
    getDetail(id, callback) {
        db.campaigns.get(id, (err, campaign) => {
            if(err || !campaign) {
                callback(err, null);
            } else {
                db.cardResults.getDetailAll(id, (err, cardResults) => {
                    campaign.cardResults = cardResults;
                    if(!campaign.template)
                        callback(err, err ? null : campaign);
                    else {
                        db.overlays.getDetail(campaign.template, (err, overlay) => {
                            campaign.template = overlay;
                            callback(err, err || !overlay ? null : campaign);
                        });
                    }
                });
            }
        });
    },
    updateDetail(entry, callback) {
        db.overlays.update(entry.template, (err, res) => {
            if(err)
                callback(err, null);
            else {
                entry.template = entry.template.id;
                db.campaigns.update(entry, (err, res) => {
                    if(err || !res)
                        callback(err, null);
                    else {
                        db.cardResults.replaceDetailAll(entry.id, entry.cardResults, callback);
                    }
                });
            }
        })
    },
    deleteDetail(id, callback) {
        db.cardResults.deleteDetailAll(id, err => {
            if(err) callback(err, null);
            else {
                db.campaigns.get(id, (err, campaign) => {
                    if(err || !campaign) callback(err, null);
                    else {
                        db.campaigns.delete(id, (err, res) => {
                            if(err || !res) {
                                callback(err, null);
                            } else if(campaign.template) {
                                db.overlays.delete(campaign.template, callback);
                            } else {
                                callback(null, res);
                            }
                        })
                    }
                })
            }
        })
    }
});

function mapRead(campaign) {
    return {
        id: campaign.id,
        name: campaign.name,
        template: campaign.template,
        isActive: !!campaign.is_active,
        createdBy: campaign.created_by,
        createdAt: campaign.created_at,
        estimatedParticipants: campaign.estimated_participants,
        url: campaign.url,
        hasPrizes: campaign.estimated_participants > 0
    };
}
function mapWrite(campaign) {
    if(campaign.hasPrizes && !campaign.estimatedParticipants)
        throw new Error('Estimated participants required when has prizes is true');
    if(!campaign.hasPrizes && campaign.estimatedParticipants)
        console.log("Warning: Ignoring campaign.estimatedParticipants because campaign.hasPrizes is false");

    return {
        name: campaign.name,
        template: campaign.template,
        is_active: campaign.isActive ? 1 : 0,
        created_by: campaign.createdBy,
        created_at: campaign.createdAt ? new Date(campaign.createdAt) : new Date(),
        estimated_participants: campaign.hasPrizes && campaign.estimatedParticipants || 0,
        url: campaign.url
    };
}