import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Image, Platform} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import Permissions from 'react-native-permissions';

const SERVER_URL = 'http://localhost:5000';

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export const ImageUpload = ({navigation}) => {
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState('off');
  const [type, setType] = useState('back');
  const [permission, setPermission] = useState('undetermined');
  const cameraRef = useRef(null);

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

  useEffect(() => {
    Permissions.check('photo').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      setPermission(response);
    });
  }, []);

  // const takePicture = async () => {
  //   if (cameraRef) {
  //     const options = {quality: 0.5, base64: true};
  //     const response = await cameraRef.current.takePictureAsync(options);
  //     //console.log(response);
  //     if (response) {
  //       setPhoto(response);
  //     }
  //   }
  // };

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
    fetch(`${SERVER_URL}/api/upload`, {
      method: 'POST',
      body: createFormData(photo, {userId: '123'}),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
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
        {photo ? (
          <View style={styles.container}>
            <Image
              source={{uri: photo.uri}}
              style={{width: 300, height: 300}}
            />
          </View>
        ) : (
          <View style={styles.container}>
            {/* <RNCamera
              ref={cameraRef}
              style={styles.preview}
              type={type}
              flashMode={flash}
            /> */}
          </View>
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
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
  },
});
