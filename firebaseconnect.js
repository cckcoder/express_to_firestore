const admin = require('firebase-admin')
const serviceAccount = require('./asset/vue2d-vtf-82c3d-firebase-adminsdk-rp5oe-8d5a238e1b.json')

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

module.exports = db
