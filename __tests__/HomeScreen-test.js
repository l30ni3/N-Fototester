/**
 * @format
 */

import 'react-native';
import React from 'react';
import {HomeScreen} from '../screens/HomeScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('@react-navigation/native');
jest.mock('@ui-kitten/components');

it('renders correctly', () => {
  // const tree = renderer.create(<HomeScreen />).toJSON();
  // expect(tree).toMatchSnapshot();
  renderer.create(<HomeScreen />);
});
