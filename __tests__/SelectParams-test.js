/**
 * @format
 */

import 'react-native';
import React from 'react';
import {SelectParams} from '../screens/SelectParams';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';
jest.useFakeTimers();
jest.mock('@react-navigation/native');

it('renders correctly', () => {
  const tree = renderer
    .create(
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <SelectParams />
        </ApplicationProvider>
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// test('submits username and password', () => {
//   const username = 'me';
//   const password = 'please';
//   const onSubmit = jest.fn();
//   const wrapper = mount(<SelectParams onSubmit={onSubmit} />);

//   wrapper
//     .find({'data-testid': 'loginForm-username'})
//     .simulate('change', {target: {value: username}});

//   wrapper
//     .find({'data-testid': 'loginForm-password'})
//     .simulate('change', {target: {value: password}});

//   wrapper.update();
//   wrapper.find({'data-testid': 'loginForm'}).simulate('submit', {
//     preventDefault: () => {},
//   });

//   expect(onSubmit).toHaveBeenCalledTimes(1);
//   expect(onSubmit).toHaveBeenCalledWith({
//     username,
//     password,
//   });
// });
