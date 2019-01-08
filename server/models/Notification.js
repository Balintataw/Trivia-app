const db = require('../db')

const dbKey = "notifications";
//create a new notification
//stringify that data
//return the new notification document

const getDocumentById = (_id) => {
    return db
        .table(dbKey) 
        .where({ _id })
        .first()
        .then(doc =>{
            return {
                ...doc,
                data: JSON.parse(doc.data)
            }
        })
}
const createNotification = (data) => {
    return db
        .table(dbKey)
        .insert({ data: JSON.stringify(data) })
        .then(docs => getDocumentById(docs[0]))
}

module.exports = {
    dbKey,
    createNotification
}