import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Image} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

export const DetailsScreen = ({route, navigation}) => {
  const {itemId} = route.params;
  const [data, setData] = useState([]);
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  useEffect(() => {
    fetch(`http://localhost:5000/api/images/${itemId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    console.log(data.name);
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Details"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {data ? (
          <>
            <Text>Daten:</Text>
            <View style={styles.container}>
              {/* <Image source={{uri: photo.uri}} style={styles.preview} /> */}
            </View>
          </>
        ) : (
          <Text>Keine Daten</Text>
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
});
