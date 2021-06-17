/**
 * @format
 */

import 'react-native';
import React from 'react';
import {ResultScreen} from '../screens/ResultScreen';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
jest.mock('@react-navigation/native');

const mockedParams = {
  route: {
    params: {
      itemId: 1,
    },
  },
  navigation: '',
};

it('renders correctly', () => {
  const tree = renderer
    .create(
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <ResultScreen {...mockedParams} />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
