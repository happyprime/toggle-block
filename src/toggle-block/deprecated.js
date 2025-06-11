import { useBlockProps } from '@wordpress/block-editor';

const deprecated = [
	{
		attributes: {
			bodyClass: { type: 'string' },
			buttonText: { type: 'string' },
			controlsId: { type: 'string' },
			labelText: { type: 'string' },
		},
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
