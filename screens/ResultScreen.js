import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
} from 'react-native';
import {
  Avatar,
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Spinner,
} from '@ui-kitten/components';
import {useIsFocused} from '@react-navigation/native';
const GLOBAL = require('./components/constants');

export const ResultScreen = ({route, navigation}) => {
  // const navigation = useNavigation();
  const {itemId} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState('');
  const isFocused = useIsFocused();

  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;

  const navigateBack = () => {
    navigation.navigate('Meine Messungen');
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  useEffect(() => {
    fetch(`http://localhost:5000/api/results/${itemId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  //when using react navigation, screens need to refresh also on isFocused event
  useEffect(() => {
    fetch(`http://localhost:5000/api/results/${itemId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, [isFocused]);

  useEffect(() => {
    console.log('useEffect after setData in ResultScreen');
    setAvatar(`${GLOBAL.SERVER_URL}/api/images/${data.name}`);
    console.log(avatar);
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Ergebnis"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}>
        <View style={styles.image_container}>
          <Avatar style={styles.avatar} source={{uri: avatar}} />
        </View>
        {!isLoading ? (
          <View style={styles.container}>
            <Text style={styles.text_bold}>Hue Circular Mean</Text>
            <Text style={styles.text}>{data.hue_circular_mean}</Text>
            <Text style={styles.text_bold}>Hue Circular Std</Text>
            <Text style={styles.text}>{data.hue_circular_std}</Text>
            <Text style={styles.text_bold}>Hue Median</Text>
            <Text style={styles.text}>{data.hue_median}</Text>
          </View>
        ) : (
          <View style={styles.spinner}>
            <Spinner size="large" />
            <Text style={styles.spinnertext}>
              Die Ergebnisse werden geladen ...
            </Text>
          </View>
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 40,
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    margin: 20,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnertext: {
    color: 'white',
    margin: 20,
  },
  text: {
    marginBottom: 10,
    color: 'white',
  },
  text_bold: {
    fontWeight: '700',
    color: 'white',
  },
  image_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {
    height: 200,
    width: 200,
    borderRadius: 200,
    margin: 8,
  },
});
