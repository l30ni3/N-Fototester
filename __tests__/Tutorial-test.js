/**
 * @format
 */

import 'react-native';
import React, {useRef} from 'react';
import {Tutorial1} from '../screens/Tutorial1';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
import {mount, shallow} from 'enzyme';

import '../setupJest';

jest.useFakeTimers();
jest.mock('@react-navigation/native');
jest.mock('react-native-snap-carousel');

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef,
  };
});

const navigation = {navigate: jest.fn()};
const ref = {
  current: {
    snapToNext: jest.fn(),
    snapToPrev: jest.fn(),
  },
};

it('renders correctly', () => {
  const tree = renderer
    .create(
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Tutorial1 navigation={navigation} />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('navigates to select params screen after clicking on "Überspringen"', () => {
  const component = shallow(<Tutorial1 navigation={navigation} />);
  component.find({children: 'Überspringen'}).simulate('press');
  expect(navigation.navigate).toBeCalledWith('Optionen wählen');
});

it('go to next or previous image slider after clicking on "Weiter"', () => {
  useRef.mockReturnValueOnce(ref);

  const component = shallow(<Tutorial1 navigation={navigation} />);
  component.find({children: 'Weiter'}).simulate('press');
  expect(ref.current.snapToNext).toHaveBeenCalled();
});

it('go to next or previous image slider after clicking on "Zurück"', () => {
  useRef.mockReturnValueOnce(ref);

  const component = shallow(<Tutorial1 navigation={navigation} />);
  component.find({children: 'Zurück'}).simulate('press');
  expect(ref.current.snapToPrev).toHaveBeenCalled();
});
