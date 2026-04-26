import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import PostJobScreen from '../screens/PostJobScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#161b22', border: '#30363d', purple: '#7c3aed',
  muted: '#8b949e', text: '#e6edf3',
};

export default function AppNavigator() {
  const { user, logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.purple,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: COLORS.bg, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700' },
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 14 }}>
            <TouchableOpacity>
              <Ionicons name="moon-outline" size={22} color={COLORS.muted} />
            </TouchableOpacity>
            {user && (
              <TouchableOpacity onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        ),
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="briefcase" size={22} color="#22c55e" />
          </View>
        ),
      })}
    >
      <Tab.Screen
        name="Search"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Ionicons name="search" size={size} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PostJob"
        component={PostJobScreen}
        options={{
          title: 'Жарыялоо',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Ionicons name="add" size={size} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyJobs"
        component={MyJobsScreen}
        options={{
          title: 'Менин',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Ionicons name="briefcase-outline" size={size} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: 'Сакталган',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Ionicons name="bookmark-outline" size={size} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
              <Ionicons name="person-outline" size={size} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bg,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
  },
  tabIcon: {
    width: 44, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  tabIconActive: { backgroundColor: '#7c3aed' },
});
