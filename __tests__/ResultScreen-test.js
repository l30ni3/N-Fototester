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

it('return result', async () => {
  fetch.mockResponseOnce(
    JSON.stringify([
      {
        crop: 'Winterweizen',
        date: 'Thu, 10 Jun 2021 15:13:48 GMT',
        growth: 'BBCH 20',
        hue_median: 70,
        id: 2,
        name: '16556622-9AC1-42CF-AA12-8D1882C04ED9.jpg',
        replicate: '2',
        type: 'image/jpeg',
        variant: '1',
      },
    ]),
  );
  const res = await fetchResult();
  expect(res).toEqual([
    {
      crop: 'Winterweizen',
      date: 'Thu, 10 Jun 2021 15:13:48 GMT',
      growth: 'BBCH 20',
      hue_median: 70,
      id: 2,
      name: '16556622-9AC1-42CF-AA12-8D1882C04ED9.jpg',
      replicate: '2',
      type: 'image/jpeg',
      variant: '1',
    },
  ]);
  expect(fetch.mock.calls.length).toEqual(1);
});

//TO DO test image response
it('return image', async () => {
  fetch.mockResponseOnce([JSON.stringify([{}]), {status: 200}]);
  const res = await fetchImage();
  expect(res).toEqual([JSON.stringify([{}]), {status: 200}]);
  expect(fetch.mock.calls.length).toEqual(1);
});
