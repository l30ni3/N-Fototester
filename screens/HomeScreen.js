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

export const HomeScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const MenuIcon = props => <Icon {...props} name="menu-outline" />;

  const MenuAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.openDrawer()}
    />
  );

  const renderItemAccessory = props => (
    <Button
      size="tiny"
      onPress={() => {
        navigation.navigate('Ergebnis', {
          itemId: props.itemId,
        });
      }}>
      Anzeigen
    </Button>
  );

  const renderItem = ({item, index}) => (
    <ListItem
      title={`${index + 1}`}
      description={`${item.name} `}
      // accessoryRight={renderItemAccessory}
      accessoryRight={props =>
        renderItemAccessory({...{itemId: item.id}, ...props})
      }
    />
  );

  useEffect(() => {
    fetch('http://localhost:5000/api/results')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
