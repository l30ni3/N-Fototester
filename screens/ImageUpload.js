import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Alert} from 'react-native';
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
import {useCamera} from 'react-native-camera-hooks';
// import Permissions from 'react-native-permissions';

const BackIcon = <Icon name="arrow-back" />;
const CameraIcon = <Icon name="camera" />;

export const ImageUpload = ({navigation}) => {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  let [flash, setFlash] = useState('off');
  let [zoom, setZoom] = useState(0);
  let [autoFocus, setAutoFocus] = useState('on');
  let [depth, setDepth] = useState(0);
  let [type, setType] = useState('back');
  let [permission, setPermission] = useState('undetermined');
  let cameraRef = useRef(null);
  // useEffect(() => {
  //   Permissions.check('photo').then(response => {
  //     // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
  //     setPermission(response);
  //   });
  // }, []);

  function toggleFlash() {
    setFlash(flashModeOrder[flash]);
  }
  function zoomOut() {
    setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
  }
  function zoomIn() {
    setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);
  }
  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(soptions);
      console.log(data.uri);
    }
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
          padding: 20,
        }}>
        <View style={styles.container}>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={type}
            flashMode={flash}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 20,
            }}>
            <Button
              style={styles.button}
              onPress={takePicture}
              accessoryLeft={CameraIcon}
            />
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: -20,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: 40,
  },
});
