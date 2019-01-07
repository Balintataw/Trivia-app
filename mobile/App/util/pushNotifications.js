// stores permissions and tokens on our server
import { Notifications, Permissions } from 'expo';

export const pushNotificationsEnabled = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    };
    if (finalStatus !== 'granted') {
        return false;
    };
    return true;
};

export const registerForPushNotifications = async () => {
    const enabled = await pushNotificationsEnabled();

    if (!enabled) {
        return Promise.resolve();
    };

    return Notifications.getExpoPushTokenAsync();
};

