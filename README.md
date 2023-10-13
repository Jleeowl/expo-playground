# Expo Pedometer Project
This is a sample project using Expo Pedometer. Note that you cannot run this project with `expo start`. Instead you will need use `expo prebuild` and `expo run` to test the app on an actual working device.

1. Install the project dependencies, and then expo install the `expo-sensors` package.
    ```
    npm install
    npx expo install expo-sensors
    ```


2. There is a known issue on Android which causes this package to not work properly ( for more details visit the following [https://github.com/expo/expo/issues/16605](https://github.com/expo/expo/issues/16605)). The crux of the problem is that the required `android.permission.ACTIVITY_RECOGNITION` is not added to the `AndroidManifest.xml`, and the `expo-sensors` package `Pedometer.requestPermissionsAsync()` function seems to always return `{ granted: true, ... }` and does not request for the required permissions properly. To resolve this issue, we need a workaround.


3. Create a plugin file anywhere in your project directory and paste the following code snippet.
    ```
    touch android-manifest.plugin.js
    ```

    ```
    const { withAndroidManifest } = require('@expo/config-plugins');

    module.exports = function androiManifestPlugin(config) {
        return withAndroidManifest(config, async (configProps) => {
            const androidManifest = configProps.modResults.manifest;

            androidManifest.$ = {
            ...androidManifest.$,
            'xmlns:tools': 'http://schemas.android.com/tools',
            };

            const activityPerm1 = { $: { 'android:name': 'android.permission.ACTIVITY_RECOGNITION' } };
            const activityPerm2 = { $: { 'android:name': 'com.google.android.gms.permission.ACTIVITY_RECOGNITION' } };

            androidManifest['uses-permission'].push(activityPerm1);
            androidManifest['uses-permission'].push(activityPerm2);

            return configProps;
        });
    };
    ```


4. Make a change by adding following code snippet into your project `app.json` | `app.config.js` file
    ```
    expo: {
        "plugins": [
            "./android-manifest.plugin.js"
        ],
        ...
    }
    ```


5. Copy and paste the following sample code to your `App.js`

    ```
    import { useState, useEffect } from 'react';
    import { StyleSheet, Text, View } from 'react-native';
    import { Pedometer } from 'expo-sensors';

    import { PermissionsAndroid } from 'react-native';

    export default function App() {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const subscribe = async () => {
        const isAvailable = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION, {
            message: "This permissions is required for the pedometer function.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        })

        if (isAvailable === PermissionsAndroid.RESULTS.GRANTED) {
            return Pedometer.watchStepCount(result => {
                setCurrentStepCount(result.steps);
            });
        } else {
            alert("Permission denied");
        return;
        }
    };

    useEffect(() => {
        const subscription = subscribe();
        return () => subscription && subscription.remove();
    }, []);

    return (
        <View style={styles.container}>
        <Text>Pedometer.isAvailableAsync(): { isPedometerAvailable }</Text>
        <Text>Walk! And watch this go up: { currentStepCount }</Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    ```

    
6. To run tests, you will need to prebuild the project and run it on an actual device.

    ```
    // generate the ./android project folder
    npx expo prebuild --clean --platform android

    // generate the .apk and run the project on your device
    npx expo run:android
    ```
