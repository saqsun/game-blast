/* eslint-disable @typescript-eslint/naming-convention */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

import type { Configuration } from 'webpack';

// prettier-ignore
const PATHS = {
    dist:               path.resolve('dist'),
    splash:             path.resolve('src', 'splash', 'index.ts'),
    app:                path.resolve('src', 'app', 'index.ts'),
    index:              path.resolve('src', 'index.ts'),
};

const config: Configuration = {
    entry: {
        splash: {
            import: [PATHS.splash],
        },
        app: {
            import: [PATHS.app],
        },
        index: {
            import: [PATHS.index],
            dependOn: ['splash', 'app'],
        },
    },

    output: {
        filename: '[name].js',
        path: path.resolve('dist'),
        clean: true,
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                oneOf: [
                    {
                        test: [/bitmaps.json/],
                    },
                    {
                        test: [/\.((jpeg|jpg|png)|(mp3|ogg|wav)|(woff|woff2)|(json))$/],
                        type: 'asset/resource',
                        generator: {
                            filename: '[path][name].[hash][ext]',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
};

export default config;
