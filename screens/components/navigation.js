import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  Drawer,
  DrawerItem,
  IndexPath,
  DrawerGroup,
  Icon,
  Text,
} from '@ui-kitten/components';
import {HomeScreen} from '../HomeScreen';
import {SelectParams} from '../SelectParams';
import {ImageUpload} from '../ImageUpload';
import {ResultScreen} from '../ResultScreen';

const {Navigator, Screen} = createDrawerNavigator();

const SmartphoneIcon = props => <Icon {...props} name="smartphone-outline" />;

const BrowserIcon = props => <Icon {...props} name="browser-outline" />;

const ColorPaletteIcon = props => (
  <Icon {...props} name="color-palette-outline" />
);

const StarIcon = props => <Icon {...props} name="star" />;

export const DrawerGroupsShowcase = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  return (
    <Drawer
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      <DrawerGroup title="Messungen" accessoryLeft={SmartphoneIcon}>
        <DrawerItem title="Meine Messungen" accessoryLeft={StarIcon} />
        <DrawerItem title="Neue Messung" accessoryLeft={StarIcon} />
      </DrawerGroup>
      <DrawerGroup title="Rechtliches" accessoryLeft={ColorPaletteIcon}>
        <DrawerItem title="Impressum" accessoryLeft={StarIcon} />
        <DrawerItem title="FAQs" accessoryLeft={StarIcon} />
      </DrawerGroup>
      <DrawerGroup title="Mein Account" accessoryLeft={BrowserIcon}>
        <DrawerItem title="Settings" accessoryLeft={StarIcon} />
        <DrawerItem title="Logout" accessoryLeft={StarIcon} />
      </DrawerGroup>
    </Drawer>
  );
};

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
    <Screen name="Optionen wählen" component={SelectParams} />
    <Screen name="Neue Messung" component={ImageUpload} />
    <Screen name="Ergebnis" component={ResultScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);
