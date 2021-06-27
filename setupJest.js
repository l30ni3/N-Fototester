import {jest} from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';
import fetchMock from 'jest-fetch-mock';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/**
 * Set up DOM in node.js environment for Enzyme to mount to
 */
const {JSDOM} = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
});
const {window} = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

configure({adapter: new Adapter()});
global.fetch = fetchMock;

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// As of react-native@0.64.X file has moved
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Ignore React Web errors when using React Native
// allow other errors to propagate if they're relevant
const suppressedErrors = /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received.*for a non-boolean attribute.*|is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.|The tag.*is unrecognized in this browser|An update to.* inside a test was not wrapped in act(...).)/;
const realConsoleError = console.error;
console.error = message => {
  if (message.match(suppressedErrors)) {
    return;
  }
  realConsoleError(message);
};
// require('react-native-mock-render/mock');
