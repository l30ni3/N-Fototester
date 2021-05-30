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
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Spinner,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';

const SERVER_URL = 'http://localhost:5000';

export const ResultScreen = ({route, navigation}) => {
  // const navigation = useNavigation();
  const {itemId} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState('');

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
          {/* <Image style={styles.image} source={{uri: `${data.avatar}`}} /> */}
          {/* <Image
            style={styles.image}
            source={require(`../api/app/views/avatars/${data.avatar}`)}
          /> */}
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
  image: {
    backgroundColor: 'red',
    borderRadius: 100,
    height: 150,
    width: 150,
  },
});
