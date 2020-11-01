const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
}
// process.env.NODE_ENV

module.exports = (env) => {
    const isProduction = env === 'production';
    return {
        entry: ['babel-polyfill', './src/app.js'],
        output: {
            path: path.resolve(__dirname, 'public', 'dist'),
            filename: '[name].[hash].js',
            chunkFilename: '[contenthash].[hash]-bundle.js',
            publicPath: '/dist'
        },
        module: {
            rules: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    loader: 'babel-loader',
                    test: /\.js$/,
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-url-loader',
                            options: {
                                limit: 10000,
                            },
                        },
                    ],
                }
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './public/template.html',
                filename: '../index.html'
            }),
            new MiniCssExtractPlugin({
                filename: "[contenthash].css",
            }),
            new webpack.HashedModuleIdsPlugin(),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new webpack.DefinePlugin({
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.ADMIN_PRIVATE_KEY_ID': JSON.stringify(process.env.ADMIN_PRIVATE_KEY_ID),
                'process.env.ADMIN_PRIVATE_KEY': JSON.stringify(process.env.ADMIN_PRIVATE_KEY),
                'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
                'process.env.CLIENT_EMAIL': JSON.stringify(process.env.CLIENT_EMAIL),
                'process.env.MARIADB_USERNAME': JSON.stringify(process.env.MARIADB_USERNAME),
                'process.env.MARIADB_PASSWORD': JSON.stringify(process.env.MARIADB_PASSWORD)
            })
        ],
        devtool: false,//isProduction ? false : 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            publicPath: '/dist',
            proxy: {
                '/api': 'http://localhost:3000'
            },
            port: 8080,
            compress: true,
            writeToDisk: true
        },
        optimization: {
            // minimizer: [new UglifyJsPlugin()],
            splitChunks: {
                chunks: 'all',
                minSize: 10000,
                maxSize: 25000,
                // cacheGroups: {
                //     vendor: {
                //         test: /[\\/]node_modules[\\/]/,
                //         name(module) {
                //             // get the name. E.g. node_modules/packageName/not/this/part.js
                //             // or node_modules/packageName
                //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                //             // npm package names are URL-safe, but some servers don't like @ symbols
                //             return `npm.${packageName.replace('@', '')}`;
                //         },
                //     },
                // },
            },
            minimize: true,
            minimizer: [new TerserPlugin()],
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    }
};