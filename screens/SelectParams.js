import React, {useState, useRef, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  IndexPath,
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
  const [variety, setVariety] = useState(new IndexPath(0));
  const [growth, setGrowth] = useState(new IndexPath(0));
  const [sowing, setSowing] = useState(new IndexPath(0));
  const displayCropValue = GLOBAL.CROP_DATA[crop.row];
  const displayVarietyValue = GLOBAL.VARIETY_DATA[variety.row];
  const displayGrowthValue = GLOBAL.GROWTH_DATA[growth.row];
  const displaySowingValue = GLOBAL.SOWING_DATA[sowing.row];

  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderOption = title => <SelectItem title={title} key={title} />;

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Optionen wählen"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.container} level="4">
        <Layout style={styles.form}>
          <Text style={styles.form_title} category="h6">
            Neue Messung
          </Text>
          <Text category="s1">Was möchten Sie analysieren?</Text>
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
                Sorte
              </Text>
            )}
            style={styles.form_select}
            placeholder="Default"
            value={displayVarietyValue}
            selectedIndex={variety}
            onSelect={index => setVariety(index)}>
            {GLOBAL.VARIETY_DATA.map(renderOption)}
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
            onSelect={index => setGrowth(index)}>
            {GLOBAL.GROWTH_DATA.map(renderOption)}
          </Select>
          <Select
            label={evaProps => (
              <Text {...evaProps} style={[evaProps.style, styles.form_label]}>
                Saattermin
              </Text>
            )}
            style={styles.form_select}
            placeholder="Default"
            selectedIndex={sowing}
            value={displaySowingValue}
            onSelect={index => setSowing(index)}>
            {GLOBAL.SOWING_DATA.map(renderOption)}
          </Select>
          <Button
            style={styles.form_submit}
            onPress={() => navigation.navigate('Neue Messung')}>
            Weiter
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
