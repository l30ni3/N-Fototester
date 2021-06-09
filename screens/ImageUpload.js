import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Image, Platform} from 'react-native';
import {
  Button,
  Card,
  Divider,
  Icon,
  IndexPath,
  Layout,
  Modal,
  TopNavigation,
  TopNavigationAction,
  Select,
  SelectItem,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {RNCamera} from 'react-native-camera';
import Permissions from 'react-native-permissions';

const GLOBAL = require('./components/constants');

export const ImageUpload = ({navigation}) => {
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [permission, setPermission] = useState('undetermined');
  const [visible, setVisible] = useState(true);
  const [crop, setCrop] = useState(new IndexPath(0));
  const [variety, setVariety] = useState(new IndexPath(0));
  const [growth, setGrowth] = useState(new IndexPath(0));
  const [sowing, setSowing] = useState(new IndexPath(0));
  const displayCropValue = GLOBAL.CROP_DATA[crop.row];
  const displayVarietyValue = GLOBAL.VARIETY_DATA[variety.row];
  const displayGrowthValue = GLOBAL.GROWTH_DATA[growth.row];
  const displaySowingValue = GLOBAL.SOWING_DATA[sowing.row];

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
    setVisible(true);
  }, []);

  useEffect(() => {
    itemId
      ? navigation.navigate('Ergebnis', {
          itemId: itemId,
        })
      : null;
  }, [itemId]);

  useEffect(() => {
    console.log(visible);
  }, [visible]);

  const handleTakePhoto = () => {
    launchCamera({noData: true}, response => {
      if (response) {
        setPhoto(response);
      }
    });
  };

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary({options}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        setPhoto(null);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setPhoto(null);
      } else {
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
    let filename = photo.fileName;
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('photo', {
      uri: localUri,
      name: filename,
      type: type,
    });
    fetch(`${GLOBAL.SERVER_URL}/api/upload`, {
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
        setIsLoading(false);
      });
  };

  const renderOption = title => <SelectItem title={title} key={title} />;
  const Header = props => (
    <View {...props}>
      <Text category="h6">Neue Messung</Text>
      <Text category="s1">Was möchten Sie analysieren?</Text>
    </View>
  );

  const toggleModal = () => {
    setVisible(!visible);
    // TODO: send these values to db
    console.log(
      displayCropValue,
      displayVarietyValue,
      displayGrowthValue,
      displaySowingValue,
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Neue Messung"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={toggleModal}>
        <Card disabled={true} header={Header} style={styles.modal}>
          <Select
            label={evaProps => (
              <Text {...evaProps} style={[evaProps.style, styles.modal_label]}>
                Kultur
              </Text>
            )}
            style={styles.select}
            placeholder="Default"
            value={displayCropValue}
            selectedIndex={crop}
            onSelect={index => setCrop(index)}>
            {GLOBAL.CROP_DATA.map(renderOption)}
          </Select>
          <Select
            label={evaProps => (
              <Text {...evaProps} style={[evaProps.style, styles.modal_label]}>
                Sorte
              </Text>
            )}
            style={styles.select}
            placeholder="Default"
            value={displayVarietyValue}
            selectedIndex={variety}
            onSelect={index => setVariety(index)}>
            {GLOBAL.VARIETY_DATA.map(renderOption)}
          </Select>
          <Select
            label={evaProps => (
              <Text {...evaProps} style={[evaProps.style, styles.modal_label]}>
                Entwicklungsstadium
              </Text>
            )}
            style={styles.select}
            placeholder="Default"
            value={displayGrowthValue}
            selectedIndex={growth}
            onSelect={index => setGrowth(index)}>
            {GLOBAL.GROWTH_DATA.map(renderOption)}
          </Select>
          <Select
            label={evaProps => (
              <Text {...evaProps} style={[evaProps.style, styles.modal_label]}>
                Saattermin
              </Text>
            )}
            style={styles.select}
            placeholder="Default"
            selectedIndex={sowing}
            value={displaySowingValue}
            onSelect={index => setSowing(index)}>
            {GLOBAL.SOWING_DATA.map(renderOption)}
          </Select>
          <Button style={styles.modal_button} onPress={toggleModal}>
            Weiter
          </Button>
        </Card>
      </Modal>
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    minWidth: 300,
    marginRight: 0,
    marginLeft: 0,
  },
  modal_label: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  modal_item: {
    color: 'white',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  modal_button: {
    marginTop: 20,
    marginBottom: 10,
  },
  select: {
    flex: 1,
    margin: 2,
  },
});
