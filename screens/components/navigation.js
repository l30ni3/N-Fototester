import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';
import {HomeScreen} from '../HomeScreen';
import {ImageUpload} from '../ImageUpload';
import {ResultScreen} from '../ResultScreen';

const {Navigator, Screen} = createDrawerNavigator();

const DrawerContent = ({navigation, state}) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={index => navigation.navigate(state.routeNames[index.row])}>
    <DrawerItem title="Alle Messungen" />
    <DrawerItem title="Neue Messung" />
  </Drawer>
);

export const DrawerNavigator = () => (
  <Navigator drawerContent={props => <DrawerContent {...props} />}>
    <Screen name="Meine Messungen" component={HomeScreen} />
    <Screen name="Neue Messung" component={ImageUpload} />
    <Screen name="Ergebnis" component={ResultScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);
