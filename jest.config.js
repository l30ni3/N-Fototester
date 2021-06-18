const config = {
  verbose: true,
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-snap-carousel)/)',
  ],
};

module.exports = config;
