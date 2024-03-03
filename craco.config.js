import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const plugins = [
  {
    plugin: {
      overrideWebpackConfig: ({ webpackConfig }) => {
        webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
        return webpackConfig;
      },
    },
  },
];
