// stores permissions and tokens on our server
import React from 'react';
import { View, AppState } from 'react-native';

import { Notifications, Permissions } from 'expo';

export const getPushToken = () => Notifications.getExpoPushTokenAsync();

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

export const setBadgeNumber = (number = 0) => Notifications.setBadgeNumberAsync(number);

export class PushNotificationManager extends React.Component {
    static defaultProps = {
        onPushNotificationSelected: () => null
    };
    componentDidMount() {
        setBadgeNumber(0);
        AppState.addEventListener('change', this.handleAppStateChange);
        this.notificationSubscription = Notifications.addListener(this.handlePushNotification)
    };
  
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.notificationSubscription.remove();
    };
  
    handleAppStateChange = (nextAppState) => {
        if(nextAppState === 'acive') {
            setBadgeNumber(0);
        }
    };

    handlePushNotification = ({ data, origin }) => {
        if (origin === 'selected') {
            //user opened the app via push notification
            this.props.onPushNotificationSelected(data);
        } else if (origin === 'received') {
            //App was open when notification was received

        }
    };
    render() {
        return <View style={{ flex:1 }}>{this.props.children}</View>
    }
};

