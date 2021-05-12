import React from 'react';
import {
  Button,
  Icon,
  Divider,
  Layout,
  List,
  ListItem,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';

// to be replaced with real data
const data = new Array(8).fill({
  title: 'Title for Item',
  description: 'Description for Item',
});

export const HomeScreen = ({navigation}) => {
  const MenuIcon = props => <Icon {...props} name="menu-outline" />;

  const MenuAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.openDrawer()}
    />
  );

  const renderItemAccessory = props => (
    <Button size="tiny" onPress={() => navigation.navigate('Details')}>
      Details
    </Button>
  );

  const renderItemIcon = props => <Icon {...props} name="person" />;

  const renderItem = ({item, index}) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Meine Messungen"
        alignment="center"
        accessoryLeft={MenuAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}>
        <List data={data} renderItem={renderItem} />
      </Layout>
    </SafeAreaView>
  );
};
