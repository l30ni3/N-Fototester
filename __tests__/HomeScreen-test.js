/**
 * @format
 */

import 'react-native';
import React from 'react';
import {HomeScreen} from '../screens/HomeScreen';
import {fetchResults, deleteResult, fetchImage} from '../screens/services';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
import {mount, shallow} from 'enzyme';
import 'jest-fetch-mock';

jest.useFakeTimers();
jest.mock('@react-navigation/native');
const navigation = {navigate: jest.fn()};

require('jest-fetch-mock').enableMocks();
// Note: test renderer must be required after react-native.
beforeEach(() => {
  fetch.resetMocks();
});

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

it('return array of results', async () => {
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
  const res = await fetchResults();
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

it('if fetching results fails, throw an error', async () => {
  expect.assertions(1);
  let response = {
    status: 400,
    body: {},
  };
  fetch.mockReject(response);
  try {
    await fetchResults();
  } catch (e) {
    expect(e).toEqual(response);
  }
});

it('deleting a result returns an updated results array', async () => {
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
  const res = await deleteResult(1);
  expect(res.some(({id}) => id === 1)).toBe(false);
  expect(fetch.mock.calls.length).toEqual(1);
});

it('returns image url to render avatar', async () => {
  fetch.mockResponseOnce(
    'http://192.168.178.20:5000/api/images/677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg',
  );
  const res = await fetchImage('677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg');
  expect(res).toEqual(
    'http://192.168.178.20:5000/api/images/677EDC83-FCC2-424A-8DB6-369B7B69C262.jpg',
  );
});

it('navigates to tutorial screen after clicking on "Neue Messung starten"', () => {
  const component = shallow(<HomeScreen navigation={navigation} />);
  component.find({children: 'Neue Messung starten'}).simulate('press');
  expect(navigation.navigate).toBeCalledWith('Tutorial 1');
});
