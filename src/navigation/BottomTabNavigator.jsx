import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import MentorshipScreen from '../screens/mentorship/MentorshipScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ResourcesScreen from '../screens/resources/ResourcesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarStyle: { height: 60, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Mentorship: 'people',
            Community: 'globe',
            Resources: 'book',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mentorship" component={MentorshipScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}