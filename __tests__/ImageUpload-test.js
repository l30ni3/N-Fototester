/**
 * @format
 */

import 'react-native';
import React from 'react';
import {ImageUpload} from '../screens/ImageUpload';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
jest.useFakeTimers();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: jest.fn()}),
  useRoute: () => ({
    params: {
      crop: 'CropValue',
      growth: 'GrowthValue',
      variant: 'VariantValue',
      replicate: 'ReplicateValue',
    },
  }),
}));
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));
jest.mock('react-native-permissions', () => ({
  Permissions: jest.fn(),
}));

const mockedParams = {
  route: {
    params: {
      crop: 'CropValue',
      growth: 'GrowthValue',
      variant: 'VariantValue',
      replicate: 'ReplicateValue',
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
          <ImageUpload {...mockedParams} />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
