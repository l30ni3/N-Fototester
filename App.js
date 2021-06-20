import React from 'react';
import {SafeAreaView} from 'react-native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {AppNavigator} from './screens/components/DrawerAppNavigator';
import ErrorBoundary from './screens/components/ErrorBoundary';
import 'react-native-gesture-handler';

export default () => (
  <>
    <ErrorBoundary>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <SafeAreaView style={{flex: 1}}>
          <AppNavigator />
        </SafeAreaView>
      </ApplicationProvider>
    </ErrorBoundary>
  </>
);
