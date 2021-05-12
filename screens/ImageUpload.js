import React, {useState} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  View,
} from '@ui-kitten/components';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const BackIcon = props => <Icon {...props} name="arrow-back" />;

export const ImageUpload = ({navigation}) => {
  const [imageSource, setImageSource] = useState(null);
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  function selectImage() {
    let options = {
      title: 'You can choose one image',
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true,
      },
    };

    launchImageLibrary(options, response => {
      console.log({response});

      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        console.log({source});
      }
    });
  }
  function uploadImage() {
    let options = {
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true,
        saveToPhotos: true,
      },
    };

    launchCamera(options, response => {
      console.log({response});

      if (response.didCancel) {
        console.log('User cancelled photo picker');
        Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        console.log({source});
      }
    });
  }

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
          padding: 20,
        }}>
        <Button
          style={{
            margin: 10,
          }}
          onPress={selectImage}>
          Galerie
        </Button>
        <Button
          style={{
            margin: 10,
          }}
          onPress={uploadImage}>
          Kamera
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
