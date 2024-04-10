/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/naming-convention
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import common from './webpack.common';
const config: Configuration = merge(common, {
    mode: 'production',

    performance: {
        hints: 'warning',
        maxAssetSize: 1024 * 1024 * 1, // 1 MB
        maxEntrypointSize: 1024 * 1024 * 1,
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    format: {
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
        ],
    },
});

export default (env: Record<string, string>): Configuration => {
    if (env.analyze) {
        config.plugins?.push(new BundleAnalyzerPlugin());
    }
    return config;
};
