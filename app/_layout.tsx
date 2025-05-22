import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Sora-Bold': require('../assets/fonts/Sora-Bold.ttf'),
    'Sora-Light': require('../assets/fonts/Sora-Light.ttf'),
    'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
    'Sora-Regular': require('../assets/fonts/Sora-Regular.ttf'),
    'Sora-SemiBold': require('../assets/fonts/Sora-SemiBold.ttf'),
    'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='index'
        options={{
          title: '',
        }}
      />
    </Stack>
  );
}
