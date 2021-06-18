/**
 * @format
 */

import 'react-native';
import React from 'react';
import {Tutorial1} from '../screens/Tutorial1';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
jest.mock('@react-navigation/native');
jest.mock('react-native-snap-carousel');

it('renders correctly', () => {
  const tree = renderer
    .create(
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Tutorial1 />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
