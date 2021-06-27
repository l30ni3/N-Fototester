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
import 'jest-fetch-mock';

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

function FormDataMock() {
  this.append = jest.fn();
}

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

it('return results id after image upload successful', async () => {
  global.FormData = FormDataMock;
  fetch.mockResponseOnce(JSON.stringify(1));
  const res = await uploadImage(global.FormData);
  expect(res).toEqual(JSON.stringify(1));
  expect(fetch.mock.calls.length).toEqual(1);
});

it('if image upload fails, throw an error', async () => {
  expect.assertions(1);
  let response = {
    status: 400,
    body: {},
  };
  fetch.mockReject(response);
  try {
    await uploadImage(global.FormData);
  } catch (e) {
    expect(e).toEqual(response);
  }
});
