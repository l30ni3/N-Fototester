/**
 * @format
 */

import 'react-native';
import React from 'react';
import {ResultScreen} from '../screens/ResultScreen';
import {fetchResult, fetchImage} from '../screens/services';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
import {mount, shallow} from 'enzyme';
import 'jest-fetch-mock';

jest.useFakeTimers();
jest.mock('@react-navigation/native');

const navigation = {navigate: jest.fn()};

const mockedParams = {
  route: {
    params: {
      itemId: 1,
    },
  },
  navigation: {navigate: jest.fn()},
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

it('fetch result returns result if non-empty object', async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      crop: 'Winterweizen',
      date: 'Thu, 10 Jun 2021 15:13:48 GMT',
      growth: 'BBCH 20',
      hue_median: 70,
      id: 2,
      name: '16556622-9AC1-42CF-AA12-8D1882C04ED9.jpg',
      replicate: '2',
      type: 'image/jpeg',
      variant: '1',
    }),
  );
  const onResponse = jest.fn();
  const onError = jest.fn();
  fetchResult()
    .then(onResponse)
    .catch(onError)
    .finally(() => {
      expect(onResponse).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();

      expect(onResponse.mock.calls[0][0]).toEqual({
        crop: 'Winterweizen',
        date: 'Thu, 10 Jun 2021 15:13:48 GMT',
        growth: 'BBCH 20',
        hue_median: 70,
        id: 2,
        name: '16556622-9AC1-42CF-AA12-8D1882C04ED9.jpg',
        replicate: '2',
        type: 'image/jpeg',
        variant: '1',
      });
    });
  expect(fetch.mock.calls.length).toEqual(1);
});

it('fetch result throws an error if empty object returns', () => {
  fetch.mockResponseOnce(JSON.stringify({}));
  const onResponse = jest.fn();
  const onError = jest.fn();

  fetchResult()
    .then(onResponse)
    .catch(onError)
    .finally(() => {
      expect(onResponse).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });
});

it('returns image url of result', async () => {
  fetch.mockResponseOnce(
    'http://192.168.178.20:5000/api/images/677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg',
  );
  const res = await fetchImage('677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg');
  expect(res).toEqual(
    'http://192.168.178.20:5000/api/images/677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg',
  );
});

it('navigates to home screen after clicking on back icon', () => {
  const component = mount(
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <ResultScreen {...mockedParams} />
      </ApplicationProvider>
    </>,
  );
  component
    .findWhere(node => node.prop('testID') === 'back-action')
    .first()
    .props()
    .onPress();
  expect(mockedParams.navigation.navigate).toBeCalledWith('Meine Messungen');
});
