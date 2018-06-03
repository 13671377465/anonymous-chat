const db = require('../../../db')

module.exports = db.defineModel('users', {
    agent: db.STRING(100),
    gender: db.BOOLEAN,
    name: db.STRING(100),
    limited: db.BIGINT
})