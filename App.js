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

    console.log(isAvailable)

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
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
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
