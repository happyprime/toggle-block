const path = require('path');
const { globSync } = require('fs');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * Retrieve all entries from subdirectories of the src directory.
 *
 * Valid entry points are index.js and view.js.
 *
 * @returns {object} An object of entry points.
 */
const getEntries = () => {
	const entries = {};
	const files = globSync(['./src/**/index.js', './src/**/view.js']);

	files.forEach((file) => {
		const relativePath = path.relative('./src', file);
		const entry = path.join(
			path.dirname(relativePath),
			path.basename(relativePath, '.js')
		);
		entries[entry] = './' + file;
	});

	return entries;
};

module.exports = {
	entry: getEntries(),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
	},
	optimization: {
		minimize: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ['@babel/plugin-transform-runtime'],
					},
				},
			},
		],
	},
	plugins: [
		new DependencyExtractionWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'src/**/block.json',
					to({ context, absoluteFilename }) {
						const srcDir = path.resolve(context, 'src');
						const relativeToSrc = path.relative(
							srcDir,
							absoluteFilename
						);
						const dir = path.dirname(relativeToSrc);
						return path.resolve(
							context,
							'build',
							dir,
							'[name][ext]'
						);
					},
				},
				{
					from: 'src/**/*.css',
					to({ context, absoluteFilename }) {
						const srcDir = path.resolve(context, 'src');
						const relativeToSrc = path.relative(
							srcDir,
							absoluteFilename
						);
						const dir = path.dirname(relativeToSrc);
						return path.resolve(
							context,
							'build',
							dir,
							'[name][ext]'
						);
					},
				},
			],
		}),
	],

	// External dependencies that should not be bundled.
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
};
