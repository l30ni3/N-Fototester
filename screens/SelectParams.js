import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  IndexPath,
  Input,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';

const GLOBAL = require('./components/constants');

export const SelectParams = ({navigation}) => {
  const [crop, setCrop] = useState(new IndexPath(0));
  const [growth, setGrowth] = useState(new IndexPath(0));
  const [variant, setVariant] = React.useState('');
  const [replicate, setReplicate] = React.useState('');

  const displayCropValue = GLOBAL.CROP_DATA[crop.row];
  const displayGrowthValue = GLOBAL.GROWTH_DATA[growth.row];

  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderOption = title => <SelectItem title={title} key={title} />;

  const handleVariantText = nextValue => {
    setVariant(nextValue);
  };

  const handleReplicateText = nextValue => {
    setReplicate(nextValue);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#101426'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard_wrapper}
        keyboardVerticalOffset={100}>
        <TopNavigation
          title="Neue Messung"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />

        <Layout style={styles.container} level="4">
          <Layout style={styles.form}>
            <Text style={styles.form_title} category="h6">
              Was möchten Sie analysieren?
            </Text>
            <Text category="s1">
              Geben Sie mehr Details zur Pflanze an, um später Ihre Ergebnisse
              besser vergleichen zu können.
            </Text>
            <Select
              label={evaProps => (
                <Text {...evaProps} style={[evaProps.style, styles.form_label]}>
                  Kultur
                </Text>
              )}
              style={styles.form_select}
              placeholder="Default"
              value={displayCropValue}
              selectedIndex={crop}
              onSelect={index => setCrop(index)}>
              {GLOBAL.CROP_DATA.map(renderOption)}
            </Select>
            <Select
              label={evaProps => (
                <Text {...evaProps} style={[evaProps.style, styles.form_label]}>
                  Entwicklungsstadium
                </Text>
              )}
              style={styles.form_select}
              placeholder="Default"
              value={displayGrowthValue}
              selectedIndex={growth}
              onSelect={index => setGrowth(index)}
              testID="select-growth">
              {GLOBAL.GROWTH_DATA.map(renderOption)}
            </Select>
            <Input
              label={evaProps => (
                <Text {...evaProps} style={[evaProps.style, styles.form_label]}>
                  Variante
                </Text>
              )}
              placeholder="Bezeichnung eingeben"
              value={variant}
              onChangeText={nextValue => handleVariantText(nextValue)}
              testID="input-variant"
            />
            <Input
              label={evaProps => (
                <Text {...evaProps} style={[evaProps.style, styles.form_label]}>
                  Wiederholung
                </Text>
              )}
              placeholder="Bezeichnung eingeben"
              value={replicate}
              onChangeText={nextValue => handleReplicateText(nextValue)}
              testID="input-replicate"
            />

            <Button
              style={styles.form_submit}
              onPress={() => {
                Keyboard.dismiss(),
                  navigation.navigate('Neue Messung', {
                    crop: displayCropValue,
                    growth: displayGrowthValue,
                    variant: variant,
                    replicate: replicate,
                  });
              }}>
              Weiter
            </Button>
          </Layout>
        </Layout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboard_wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#101426',
  },
  form: {
    padding: 20,
    borderRadius: 5,
  },
  form_title: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  form_label: {
    paddingTop: 15,
    paddingBottom: 5,
  },
  form_select: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  form_submit: {
    marginTop: 20,
    marginBottom: 5,
  },
});
