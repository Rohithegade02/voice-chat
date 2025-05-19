import { FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Text to Speech',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name='file-audio' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='speech-to-text'
        options={{
          title: 'Speech to Text',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name='microphone' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
