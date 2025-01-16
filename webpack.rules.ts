import type { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
  // Handle native node modules (unchanged)
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },

  // Add this .mjs rule
  {
    test: /\.mjs$/,
    include: /node_modules\/pdfjs-dist/,   // or /pdfjs-dist\/build/ specifically
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash].[ext]',
        outputPath: 'static/js', // or wherever you want to put it
      },
    },
    type: 'javascript/auto',
  },

  // The vercel asset relocator rule (unchanged)
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },

  // TypeScript loader (unchanged)
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
];
