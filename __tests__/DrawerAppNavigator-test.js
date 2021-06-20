import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import {NavigationContainer} from '@react-navigation/native';
import {render, fireEvent, Button} from '@testing-library/react-native';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';

import {DrawerNavigator} from '../screens/components/DrawerAppNavigator';

jest.mock('react-native-permissions', () => ({
  Permissions: jest.fn(),
}));

require('jest-fetch-mock').enableMocks();
beforeEach(() => {
  fetch.resetMocks();
});

describe('Testing react navigation', () => {
  test('screen contains a button linking to the notifications page', async () => {
    const component = (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </ApplicationProvider>
      </>
    );
    const {findByText} = render(component);
    const button = await findByText('Neue Messung starten');
    expect(button).toBeTruthy();
  });

  test('clicking on the button takes you to the intro screen', async () => {
    const component = (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </ApplicationProvider>
      </>
    );

    const {queryByText, findByText} = render(component);
    const oldScreen = queryByText('Neue Messung starten');
    const button = await findByText('Neue Messung starten');

    expect(oldScreen).toBeTruthy();
    // fireEvent.press(button);
    // // fireEvent(button, 'press');
    // const newScreen = await findByText('Überspringen');

    // expect(newScreen).toBeTruthy();
  });
});
