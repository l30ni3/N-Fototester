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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import Permissions from 'react-native-permissions';

const SERVER_URL = 'http://localhost:5000';

const createFormData = photo => {
  let localUri =
    Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
  let filename = localUri.split('/').pop();
  // Infer the type of the image
  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  const data = new FormData();
  data.append('photo', {
    name: filename,
    type: type,
    uri: localUri,
  });

  return data;
};

export const ImageUpload = ({navigation}) => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [permission, setPermission] = useState('undetermined');

  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;
  const CameraIcon = props => <Icon {...props} name="camera" />;
  const UploadIcon = props => <Icon {...props} name="upload" />;
  const CloseIcon = props => <Icon {...props} name="close" />;
  const NextIcon = props => (
    <Icon {...props} name="arrow-ios-forward-outline" />
  );

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  // todo properly ask for permissions
  useEffect(() => {
    Permissions.check('photo').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      setPermission(response);
    });
  }, []);

  useEffect(() => {
    itemId
      ? navigation.navigate('Ergebnis', {
          itemId: itemId,
        })
      : null;
  }, [itemId]);

  // todo properly ask for permissions
  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const handleTakePhoto = () => {
    launchCamera({noData: true}, response => {
      // console.log(response);
      if (response) {
        setPhoto(response);
      }
    });
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      // console.log(response);
      if (response) {
        setPhoto(response);
      }
    });
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
  };

  const handleUploadPhoto = () => {
    setIsLoading(true);
    let localUri =
      Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
    let filename = localUri.split('/').pop();
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('photo', {uri: localUri, name: filename, type: type});
    fetch(`${SERVER_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'multipart/form-data',
      // },
    })
      .then(response => response.text())
      .then(response => {
        console.log('upload succes', response);
        setItemId(response);
        setIsLoading(false);
        setPhoto(null);
      })
      .catch(error => {
        console.log('upload error', error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Neue Messung"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}>
        {!isLoading ? (
          <>
            {photo ? (
              <View style={styles.container}>
                <Image source={{uri: photo.uri}} style={styles.preview} />
              </View>
            ) : (
              <View style={styles.container}></View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {photo ? (
                <>
                  <Button
                    style={styles.button}
                    onPress={handleDeletePhoto}
                    accessoryRight={CloseIcon}>
                    Verwerfen
                  </Button>
                  <Button
                    style={styles.button}
                    onPress={handleUploadPhoto}
                    accessoryRight={NextIcon}>
                    Verwenden
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    style={styles.button}
                    onPress={handleChoosePhoto}
                    accessoryRight={UploadIcon}>
                    Aus Gallerie
                  </Button>
                  <Button
                    style={styles.button}
                    onPress={handleTakePhoto}
                    accessoryRight={CameraIcon}>
                    Neues Foto
                  </Button>
                </>
              )}
            </View>
          </>
        ) : (
          <View style={styles.spinner}>
            <Spinner size="large" />
            <Text style={styles.spinnertext}>
              Die Bilddaten werden verarbeitet ...{' '}
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
