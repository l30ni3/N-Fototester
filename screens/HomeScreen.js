import React, {useState, useEffect} from 'react';
import {
  Button,
  Icon,
  Divider,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';

// to be replaced with real data
// const data = new Array(8).fill({
//   title: 'Title for Item',
//   description: 'Description for Item',
// });

export const HomeScreen = ({navigation}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [data, setData] = useState([]);
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
      title={`${item.timestamp}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  useEffect(() => {
    fetch('http://localhost:5000/api/measurements')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

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
        {/* <Text>The current time is {currentTime}.</Text> */}
        <List data={data} renderItem={renderItem} />
        <Button
          style={{
            margin: 30,
          }}
          onPress={() => navigation.navigate('Neue Messung')}>
          {' '}
          Neue Messung
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
