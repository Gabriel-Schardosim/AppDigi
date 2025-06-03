module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // usa tudo necessário (incluindo expo-router e react-native-paper)
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: true,
        },
      ],
    ],
  };
};
