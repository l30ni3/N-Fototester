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
import {fetchResults, deleteResult} from './services/Services';
const GLOBAL = require('./components/constants');

export const HomeScreen = props => {
  const navigation = props.navigation;
  const [data, setData] = useState([]);
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
      source={{uri: `${GLOBAL.SERVER_URL}/api/images/${props.name}`}}
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
