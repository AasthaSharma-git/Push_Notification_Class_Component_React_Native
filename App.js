import React from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default class App extends React.Component {
  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }
  async schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hey There! 📬',
        body: 'I am your notification!',
        sound: true,
      },
      trigger: {
        seconds: 5,
      },
    });
  }

  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        lightColor: '#FF231F7C',
      });
    }
    console.log(Device.isDevice);
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            this.schedulePushNotification();
          }}
        />
      </View>
    );
  }
}
