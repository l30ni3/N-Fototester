import React, {useState, useRef, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

const GLOBAL = require('./components/constants');

export const Tutorial1 = ({navigation}) => {
  const BackIcon = props => <Icon {...props} name="chevron-left-outline" />;
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState(GLOBAL.CAROUSEL_ITEMS);
  const ref = useRef(null);
  const window = Dimensions.get('window');
  const CARD_WIDTH = window.width * 0.8;
  const CAROUSEL_WIDTH = window.width;
  const [isFirst, setIsFirst] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const goForward = () => {
    ref.current.snapToNext();
  };

  const goBack = () => {
    ref.current.snapToPrev();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderItem = useCallback(({item, index}, parallaxProps) => {
    return (
      <View style={styles.intro_item}>
        <ParallaxImage
          source={item.thumbnail}
          containerStyle={styles.item_image_container}
          style={styles.item_image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.item_text} category="h6">
          {item.title}
        </Text>
        <Text style={styles.item_text}>{item.text}</Text>
      </View>
    );
  }, []);

  useEffect(() => {
    console.log(activeIndex);
    if (activeIndex == 0) {
      setIsFirst(true);
    } else if (activeIndex == 2) {
      setIsLast(true);
    } else {
      setIsFirst(false);
      setIsLast(false);
    }
  }, [activeIndex]);

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
            renderItem={renderItem}
            onSnapToItem={index => setActiveIndex(index)}
            sliderWidth={CAROUSEL_WIDTH}
            itemWidth={CARD_WIDTH}
            windowSize={1}
            hasParallaxImages={true}
            testID="carousel"
          />
        </Layout>

        <Layout style={styles.intro_bottom} level="4">
          {isFirst ? (
            <Button
              style={styles.intro_button}
              onPress={goBack}
              disabled={true}>
              Zurück
            </Button>
          ) : (
            <Button style={styles.intro_button} onPress={goBack}>
              Zurück
            </Button>
          )}

          {isLast ? (
            <Button
              style={styles.intro_button}
              onPress={() => navigation.navigate('Optionen wählen')}>
              Starten
            </Button>
          ) : (
            <Button style={styles.intro_button} onPress={goForward}>
              Weiter
            </Button>
          )}
        </Layout>
        <Layout style={styles.skip} level="4">
          <Text
            style={styles.skip_text}
            onPress={() => navigation.navigate('Optionen wählen')}>
            Überspringen
          </Text>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  intro: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  intro_item: {
    borderRadius: 5,
    flex: 1,
    marginTop: 15,
  },
  intro_titel: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  intro_bottom: {
    flexDirection: 'row',
    padding: 25,
  },
  intro_button: {
    flex: 1,
    margin: 15,
  },
  skip: {
    alignItems: 'center',
    paddingBottom: 25,
  },
  skip_text: {
    color: '#3366FF',
    fontWeight: '600',
  },
  item_image_container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
  },
  item_image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  item_text: {
    marginTop: 5,
  },
});
