import React, { useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import GamesScreen from './src/screens/GamesScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SnapLearnScreen from './src/screens/SnapLearnScreen';
import LiveSessionsScreen from './src/screens/LiveSessionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WordMatchGameScreen from './src/screens/WordMatchGameScreen';
import LessonPlayerScreen from './src/screens/LessonPlayerScreen';

// Import store
import { store } from './src/store/store';

// Import theme
import { colors, fonts, spacing, borderRadius, shadows } from './src/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Lessons') {
            iconName = 'school';
          } else if (route.name === 'Games') {
            iconName = 'games';
          } else if (route.name === 'Progress') {
            iconName = 'trending-up';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Monoko' }}
      />
      <Tab.Screen 
        name="Lessons" 
        component={LessonsScreen}
        options={{ title: 'Learn' }}
      />
      <Tab.Screen 
        name="Games" 
        component={GamesScreen}
        options={{ title: 'Games' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  useEffect(() => {
    // Set status bar style
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: colors.white },
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="SnapLearn" 
              component={SnapLearnScreen}
              options={{
                headerShown: true,
                title: 'Snap & Learn',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontFamily: fonts.bold,
                },
              }}
            />
            <Stack.Screen 
              name="LiveSessions" 
              component={LiveSessionsScreen}
              options={{
                headerShown: true,
                title: 'Live with a Local',
                headerStyle: {
                  backgroundColor: colors.secondary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontFamily: fonts.bold,
                },
              }}
            />
            <Stack.Screen 
              name="WordMatchGame" 
              component={WordMatchGameScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="LessonPlayer" 
              component={LessonPlayerScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
