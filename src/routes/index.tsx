import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HeaderImage, HeaderTitle } from '../styles/styles';

import { Platform, View } from 'react-native';
import { colors } from '../styles/colors';

import Dashboard from '../pages/Dashboard';
import Crowd from '../pages/Crowd';
import CrowdList from '../pages/CrowdList';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface TabBarIconProps {
  color: string;
}

const LogoTitle = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <HeaderImage />
      <HeaderTitle>COVID-19 Radar</HeaderTitle>
    </View>
  );
}

const TabsRoutes = () => {
  return (
            <Tab.Navigator
              initialRouteName="Estados"
              tabBarOptions={{
                activeTintColor: colors.primary,
                inactiveTintColor: colors.whiteLight,
                style: {
                  borderTopWidth: 0,
                  borderTopColor: 'transparent',
                  backgroundColor: colors.background,
                  shadowColor: colors.shadow,
                  ...Platform.select({
                    ios: {
                      shadowOffset: { height: 2, width: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 20,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                },
              }}
            >
            {/* Fluxo da lista dos estados */}
              <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                  tabBarLabel: 'Estados',
                  tabBarIcon: ({ color }: TabBarIconProps) => (
                    <Icon name="view-list" color={color} size={22} />
                  ),
                }}
              />

              {/* Fluxo da lista dos estados do crowd*/}
              <Tab.Screen
                name="CrowdList"
                component={CrowdList}
                options={{
                  tabBarLabel: 'Crowd Lista',
                  tabBarIcon: ({ color }: TabBarIconProps) => (
                    <Icon name="list-alt" color={color} size={22} />
                  ),
                }}
              />
            
            {/* Fluxo do crowd */}
              <Tab.Screen
                name="Crowd"
                component={Crowd}
                options={{
                  tabBarLabel: 'Crowd Registro',
                  tabBarIcon: ({ color }: TabBarIconProps) => (
                    <Icon name="groups" color={color} size={22} />
                  ),
                }}
              />
            </Tab.Navigator>
  );
};

const Routes: React.FC = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <LogoTitle />,
          headerTintColor: colors.white,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: colors.background
          },
        }}>
        <Stack.Screen
          name="TabsRoutes"
          options={{
            title: 'COVID-19 Radar',
          }}
          component={TabsRoutes}
        />
      </Stack.Navigator>
  );
}

export default Routes;