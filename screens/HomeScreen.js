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
import {fetchResults, deleteResult, fetchImage} from './services';
const GLOBAL = require('./components/constants');

export const HomeScreen = props => {
  const navigation = props.navigation;
  const [data, setData] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const MenuIcon = props => <Icon {...props} name="menu-outline" />;

  const isFocused = useIsFocused();

  const MenuAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => navigation.openDrawer()}
    />
  );

  const renderAvatar = props => {
    var avatar = avatars.reduce((result, item) => {
      if (item.name === props.name) {
        result = `${result}${item.uri}`;
      }
      return result;
    }, '');

    console.log(avatar);

    return (
      <Avatar
        size="tiny"
        source={
          avatar ? {uri: avatar} : {uri: 'https://www.gravatar.com/avatar'}
        }
      />
    );
  };

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
          console.log(props.itemId);
          deleteResult({...props}).then(res => setData(res));
        }}
        name="trash-outline"
      />
    </>
  );

  const renderItem = ({item, index}) => (
    <ListItem
      accessoryLeft={props => renderAvatar({...{name: item.name}, ...props})}
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
    fetchResults().then(json => setData(json));
  }, []);

  //when using react navigation, screens need to refresh also on isFocused event
  useEffect(() => {
    fetchResults().then(json => setData(json));
  }, [isFocused]);

  useEffect(() => {
    const updatedAvatars = [];
    data.map(item =>
      updatedAvatars.push({
        name: item.name,
        uri: fetchImage(item.name),
      }),
    );
    setAvatars(updatedAvatars);
  }, [data]);

  useEffect(() => {
    console.log('avatars', avatars);
  }, [avatars]);

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
          title="Neue Messung starten"
          testID="buttonOnPress"
          onPress={() => navigation.navigate('Tutorial 1')}>
          Neue Messung starten
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
