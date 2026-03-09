import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { AppProvider } from '../src/store/AppContext';
import { useDatabase } from '../src/hooks/useDatabase';
import { lightTheme, darkTheme } from '../src/utils/colors';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { ready, error } = useDatabase();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if ((ready || error) && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [ready, error, fontsLoaded]);

  if (!ready && !error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="task/new"
          options={{
            title: 'New Task',
            presentation: 'modal',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="task/[id]"
          options={{
            title: 'Edit Task',
            presentation: 'modal',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="focus/session"
          options={{
            title: 'Focus Session',
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="insights"
          options={{
            title: 'Insights',
            presentation: 'modal',
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootLayoutInner />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
