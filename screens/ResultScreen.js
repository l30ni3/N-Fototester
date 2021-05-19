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
        {!isLoading ? (
          <View style={styles.container}>
            <Text style={styles.spinnertext}>{data.hue_median}</Text>
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
    backgroundColor: 'black',
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
});
