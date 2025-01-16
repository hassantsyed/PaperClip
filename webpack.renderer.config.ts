import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader'
  ],
});

rules.push({
  test: /pdf\.worker\.(min\.)?mjs$/,
  type: 'asset/resource',
  generator: {
    filename: '[name][ext]'
  }
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.mjs'],
  },
  output: {
    publicPath: './',
  }
};
