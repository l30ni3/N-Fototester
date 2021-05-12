import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';
import {
  Drawer,
  DrawerGroup,
  DrawerItem,
  IndexPath,
  Icon,
  Text,
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {HomeScreen} from '../HomeScreen';
import {DetailsScreen} from '../DetailsScreen';
import {FotoScreen} from '../FotoScreen';

const {Navigator, Screen} = createDrawerNavigator();

const DrawerContent = ({navigation, state}) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={index => navigation.navigate(state.routeNames[index.row])}>
    <DrawerItem title="Meine Messungen" />
    <DrawerItem title="Details" />
    <DrawerItem title="Neue Messung" />
  </Drawer>
);

export const DrawerNavigator = () => (
  <Navigator drawerContent={props => <DrawerContent {...props} />}>
    <Screen name="Meine Messungen" component={HomeScreen} />
    <Screen name="Details" component={DetailsScreen} />
    <Screen name="Neue Messung" component={FotoScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);
