// eslint-disable-next-line @typescript-eslint/naming-convention
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';

import common from './webpack.common';
const devServer: DevServerConfiguration = {
    liveReload: true,
    hot: true,
    host: '0.0.0.0',
    client: { logging: 'error' },
    port: 8080,
    devMiddleware: {
        stats: {
            all: false,
            errors: true,
            colors: true,
            timings: true,
            performance: true,
        },
    },
};

const config: Configuration = merge(common, {
    devServer,
    mode: 'development',
    devtool: 'eval-source-map',

    plugins: [
        new ForkTsCheckerWebpackPlugin({
            devServer: true,
            typescript: {
                configFile: path.resolve('tsconfig.json'),
            },
        }),
    ],
});

export default config;
