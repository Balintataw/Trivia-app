const { Expo } = require("expo-server-sdk");
const db = require('../db');

const dbKey = "pushNotifications"; //matches table name

const addPushToken = ({
    token,
    platform,
    timezoneOffset
}) => {
    if (!Expo.isExpoPushToken(token)) {
        return Promise.reject(new Error("Invalid token"));
    }
    return db
        .table(dbKey)
        .where({ token })
        .then(docs => {
        if (docs.length > 0) {
            return Promise.reject(new Error("Push token already exists."))
        }
        return db.table(dbKey).insert({
            token,
            platform,
            timezoneOffset
        })
    });
}

const sendNewNotificationToAll = ({ questions, nextQuestion }) => {
    const expo = new Expo();
    return db
        .table(dbKey)
        .then(docs => {
            const messages = [];
            docs.forEach(doc => {
                messages.push({
                    to: doc.token,
                    sound: "default",
                    body: questions[0].question // this is the body of the question/answer displayed to the user in the notification
                })
            })
            return {
                messages
            };
        })
        .then(({ messages }) => {
            const messageChunks = expo.chunkPushNotifications(messages);
            const expoRequests = messageChunks.map(chunk => {
                return expo.sendPushNotificationsAsync(chunk);
            });
            return Promise.all(expoRequests); //sends to provider
        })
};

module.exports = {
    dbKey,
    addPushToken,
    sendNewNotificationToAll
};