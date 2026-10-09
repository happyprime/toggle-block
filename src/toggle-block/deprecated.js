import { useBlockProps } from '@wordpress/block-editor';

// Every save below shipped with these supports. Deprecations do not inherit
// supports from block.json, so without them an old toggle with an anchor or
// custom spacing fails validation.
const supports = {
	align: true,
	alignWide: true,
	anchor: true,
	color: {
		background: true,
		enableContrastChecker: true,
		text: true,
		gradients: true,
	},
	defaultStylePicker: true,
	dimensions: {
		minHeight: true,
	},
	html: false,
	position: {
		sticky: false,
	},
	spacing: {
		margin: true,
		padding: true,
	},
	typography: {
		fontSize: true,
		lineHeight: true,
	},
};

const deprecated = [
	{
		attributes: {
			bodyClass: { type: 'string', default: '' },
			buttonText: { type: 'string', default: '' },
			controlsId: { type: 'string', default: '' },
			defaultToggle: { type: 'boolean', default: false },
			labelText: { type: 'string', default: '' },
		},
		supports,
		save: (props) => {
			const {
				attributes: {
					bodyClass,
					buttonText,
					controlsId,
					defaultToggle,
					labelText,
				},
			} = props;

			return (
				<button
					{...useBlockProps.save()}
					aria-label={labelText}
					aria-controls={controlsId}
					{...(bodyClass && { 'data-body-class': bodyClass })}
					{...(defaultToggle && { 'data-default-toggle': 'true' })}
				>
					<span>{buttonText}</span>
				</button>
			);
		},
	},
	{
		attributes: {
			bodyClass: { type: 'string', default: '' },
			buttonText: { type: 'string', default: '' },
			controlsId: { type: 'string', default: '' },
			labelText: { type: 'string', default: '' },
		},
		supports,
		save: (props) => {
			const {
				attributes: { bodyClass, buttonText, controlsId, labelText },
			} = props;

			return (
				<button
					{...useBlockProps.save()}
					aria-label={labelText}
					aria-controls={controlsId}
					{...(bodyClass && { 'data-body-class': bodyClass })}
				>
					<span>{buttonText}</span>
				</button>
			);
		},
	},
	{
		attributes: {
			bodyClass: { type: 'string' },
			buttonText: { type: 'string' },
			controlsId: { type: 'string' },
			labelText: { type: 'string' },
		},
		supports,
		save: (props) => {
			const {
				attributes: { bodyClass, buttonText, controlsId, labelText },
			} = props;

			return (
				<button
					{...useBlockProps.save()}
					aria-label={labelText}
					aria-controls={controlsId}
					{...(bodyClass && { 'data-body-class': bodyClass })}
				>
					{buttonText}
				</button>
			);
		},
	},
];

export default deprecated;
