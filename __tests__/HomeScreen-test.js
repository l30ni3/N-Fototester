/**
 * @format
 */

import 'react-native';
import React from 'react';
import {HomeScreen} from '../screens/HomeScreen';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
jest.mock('@react-navigation/native');
// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  const tree = renderer
    .create(
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <HomeScreen />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
