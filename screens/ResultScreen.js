import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
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
import {fetchResult, fetchImage} from './services';
import {useIsFocused} from '@react-navigation/native';
const GLOBAL = require('./components/constants');

export const ResultScreen = ({route, navigation}) => {
  // const navigation = useNavigation();
  const {itemId} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState('');
  const isFocused = useIsFocused();
  const window = Dimensions.get('window');

  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;

  const navigateBack = () => {
    navigation.navigate('Meine Messungen');
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  //when using react navigation, screens need to refresh also on isFocused event
  useEffect(() => {
    fetchResult(itemId)
      .then(json => setData(json))
      .catch(error => console.log(error));
  }, [isFocused, itemId]);

  useEffect(() => {
    console.log('useEffect after setData in ResultScreen');
    setAvatar(fetchImage(data.name));
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Ergebnis"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.container} level="4">
        {!isLoading ? (
          <>
            <View style={styles.image_container}>
              {/* <Avatar style={styles.avatar} source={{uri: avatar}} /> */}
              <Image
                style={{width: window.width, height: window.height / 4}}
                source={avatar ? {uri: avatar} : null}
              />
            </View>
            <View
              style={[
                styles.text_container,
                {
                  width: window.width,
                  height: (window.height / 4) * 3,
                },
              ]}>
              <Text style={styles.text_result}>{data.hue_median}</Text>
              <Text style={styles.text_bold}>Datum:</Text>
              <Text style={styles.text}>{data.date}</Text>
              <Text style={styles.text_bold}>Kultur:</Text>
              <Text style={styles.text}>{data.crop}</Text>
              <Text style={styles.text_bold}>Entwicklungsstadium:</Text>
              <Text style={styles.text}>{data.growth}</Text>
              <Text style={styles.text_bold}>Variantenbezeichnung:</Text>
              <Text style={styles.text}>{data.variant}</Text>
              <Text style={styles.text_bold}>Wiederholung:</Text>
              <Text style={styles.text}>{data.replicate}</Text>
            </View>
          </>
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
    justifyContent: 'flex-start',
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
  text_result: {
    fontSize: 120,
    color: '#3366FF',
    padding: 10,
  },
  text_bold: {
    fontWeight: '700',
    color: 'white',
  },
  image_container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  text_container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
