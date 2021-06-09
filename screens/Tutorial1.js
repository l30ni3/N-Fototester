import React, {useState, useRef, useCallback} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';
import Carousel from 'react-native-snap-carousel';

const GLOBAL = require('./components/constants');

export const Tutorial1 = ({navigation}) => {
  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState(GLOBAL.CAROUSEL_ITEMS);
  const ref = useRef(null);

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={styles.intro_item}>
        <Text>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title="Intro"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.container} level="4">
        <Layout style={styles.intro} level="4">
          <Carousel
            layout={'default'}
            ref={ref}
            data={carouselItems}
            sliderWidth={300}
            itemWidth={300}
            renderItem={renderItem}
            onSnapToItem={index => setActiveIndex(index)}
          />
        </Layout>
        {/* <Layout style={styles.intro_bottom} level="4">
          <Button
            style={styles.intro_button}
            onPress={() => setActiveIndex(activeIndex - 1)}>
            Zurück
          </Button>
          <Button
            style={styles.intro_button}
            onPress={() => setActiveIndex(activeIndex + 1)}>
            Weiter
          </Button>
        </Layout> */}
        <Layout style={styles.intro_bottom} level="4">
          <Button
            style={styles.intro_button}
            onPress={() => navigation.navigate('Optionen wählen')}>
            Überspringen
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
  intro: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  intro_item: {
    backgroundColor: 'red',
    borderRadius: 5,
    flex: 1,
    padding: 50,
    margin: 15,
  },
  intro_titel: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  intro_bottom: {
    flexDirection: 'row',
  },
  intro_button: {
    flex: 1,
    margin: 5,
  },
});
