import React, {useState, useEffect} from 'react';
import {
  Avatar,
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
import {useIsFocused} from '@react-navigation/native';
import Moment from 'react-moment';

export const HomeScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [responseBlob, setResponseBlob] = useState([]);
  const [blobData, setBlobData] = useState([]);
  const MenuIcon = props => <Icon {...props} name="menu-outline" />;

  const isFocused = useIsFocused();

  const MenuAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.openDrawer()}
    />
  );

  const renderAvatar = props => (
    <Avatar
      size="tiny"
      source={require('../api/avatars/728EE956-850C-43D7-8551-0421D7063611.jpg')}
    />
  );

  const renderItemAccessory = props => (
    <>
      <Button
        size="tiny"
        onPress={() => {
          navigation.navigate('Ergebnis', {
            itemId: props.itemId,
          });
        }}>
        Anzeigen
      </Button>
      <Icon
        {...props}
        onPress={() => {
          fetch(`http://localhost:5000/api/results/${props.itemId}/delete`)
            .then(res => res.json())
            .then(json => setData(json))
            .catch(error => console.error(error));
        }}
        name="trash-outline"
      />
    </>
  );

  const renderItem = ({item, index}) => (
    <ListItem
      accessoryLeft={props => renderAvatar({...{itemId: item.id}, ...props})}
      title={
        <Moment element={Text} fromNow>
          {item.date}
        </Moment>
      }
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
    fetch('http://localhost:5000/api/results')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, [isFocused]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  // const renderAvatar = props => {
  //   fetch(`http://localhost:5000/api/results/avatar/${props.itemId}`)
  //     .then(res => setResponseBlob(res.blob()))
  //     .catch(error => console.error(error));

  //   var reader = new FileReader();
  //   reader.onload = () => {
  //     console.log(reader.result);
  //     setBlobData(reader.result);
  //     reader.readAsDataURL(responseBlob);
  //   };

  //   return <Avatar source={{uri: 'data:image/jpeg;base64,' + blobData}} />;
  // };

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
