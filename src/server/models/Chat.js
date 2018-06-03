const db = require('../../../db');

module.exports = db.defineModel('chat', {
    ownerId: db.STRING(50), 
    text: db.STRING(500), 
    toOwnerId: db.STRING(50),
    isread: db.BOOLEAN,
});