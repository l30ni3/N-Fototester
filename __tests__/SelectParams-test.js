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
import {mount, shallow} from 'enzyme';

jest.useFakeTimers();
jest.mock('@react-navigation/native');
const navigation = {navigate: jest.fn()};

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

it('navigates to upload image screen after clicking on "Weiter"', () => {
  const component = shallow(<SelectParams navigation={navigation} />);
  component.find({children: 'Weiter'}).simulate('press');
  expect(navigation.navigate).toBeCalledWith('Neue Messung', {
    crop: 'Winterweizen',
    growth: 'BBCH 20',
    replicate: '',
    variant: '',
  });
});

it('expect variant input to exist', () => {
  const component = mount(
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SelectParams navigation={navigation} />
      </ApplicationProvider>
    </>,
  );
  const input = component
    .findWhere(node => node.prop('testID') === 'input-variant')
    .first();

  expect(input).toBeTruthy();
});

it('update state and props after changing variant input', () => {
  const handleVariantText = jest.fn();
  const component = mount(
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SelectParams
          navigation={navigation}
          onChangeText={handleVariantText}
        />
      </ApplicationProvider>
    </>,
  );
  const input = component
    .findWhere(node => node.prop('testID') === 'input-variant')
    .first();

  input.props().onChangeText('new variant value');
  component.update();
  expect(
    component
      .findWhere(node => node.prop('testID') === 'input-variant')
      .first()
      .props()
      .value.toString(),
  ).toEqual('new variant value');
  component.find({children: 'Weiter'}).first().props().onPress();
  expect(navigation.navigate).toBeCalledWith('Neue Messung', {
    crop: 'Winterweizen',
    growth: 'BBCH 20',
    replicate: '',
    variant: 'new variant value',
  });
});

it('expect replicate input to exist', () => {
  const component = mount(
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SelectParams navigation={navigation} />
      </ApplicationProvider>
    </>,
  );
  const input = component
    .findWhere(node => node.prop('testID') === 'input-replicate')
    .first();

  expect(input).toBeTruthy();
});

it('update state and props after changing replicate input', () => {
  const handleVariantText = jest.fn();
  const component = mount(
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SelectParams
          navigation={navigation}
          onChangeText={handleVariantText}
        />
      </ApplicationProvider>
    </>,
  );
  const input = component
    .findWhere(node => node.prop('testID') === 'input-replicate')
    .first();

  input.props().onChangeText('new replicate value');
  component.update();
  expect(
    component
      .findWhere(node => node.prop('testID') === 'input-replicate')
      .first()
      .props()
      .value.toString(),
  ).toEqual('new replicate value');
  component.find({children: 'Weiter'}).first().props().onPress();
  expect(navigation.navigate).toBeCalledWith('Neue Messung', {
    crop: 'Winterweizen',
    growth: 'BBCH 20',
    replicate: 'new replicate value',
    variant: '',
  });
});
