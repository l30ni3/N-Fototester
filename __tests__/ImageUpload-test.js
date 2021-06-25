/**
 * @format
 */

import 'react-native';
import React from 'react';
import {ImageUpload} from '../screens/ImageUpload';
import {uploadImage} from '../screens/services';
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

//TO DO test image response
it('return result id', async () => {
  fetch.mockResponseOnce([JSON.stringify([{}]), {status: 200}]);
  const res = await uploadImage();
  expect(res).toEqual([JSON.stringify([{}]), {status: 200}]);
  expect(fetch.mock.calls.length).toEqual(1);
});
