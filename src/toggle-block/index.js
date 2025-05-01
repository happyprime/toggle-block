// WordPress dependencies.
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import metadata from './block.json';

// Extend the navigation block to allow the toggle block.
import './extend-navigation-block';

const Edit = (props) => {
	const {
		attributes: { bodyClass, buttonText, controlsId, labelText },
		setAttributes,
	} = props;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Toggle settings', 'toggle-block')}>
					<TextControl
						label={__('Controls ID', 'toggle-block')}
						description={__(
							'Enter the HTML anchor ID of the element this toggle controls.',
							'toggle-block'
						)}
						value={controlsId}
						onChange={(value) =>
							setAttributes({ controlsId: value })
						}
					/>
					<TextControl
						label={__('Screen reader text', 'toggle-block')}
						description={__(
							'Enter a description of what this toggle controls.',
							'toggle-block'
						)}
						value={labelText}
						onChange={(value) =>
							setAttributes({ labelText: value })
						}
					/>
					<TextControl
						label={__('Body class', 'toggle-block')}
						description={__(
							'Enter a class to add to the body when the toggle is active.',
							'toggle-block'
						)}
						value={bodyClass}
						onChange={(value) =>
							setAttributes({ bodyClass: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				{...useBlockProps()}
				tagName="span"
				label={__('Button text', 'toggle-block')}
				placeholder={__('Button text', 'toggle-block')}
				value={buttonText}
				onChange={(value) => {
					setAttributes({ buttonText: value });
				}}
			/>
		</>
	);
};

const Save = (props) => {
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
};

const Transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/navigation-link'],
			transform: (attributes, innerBlocks) => {
				return createBlock(
					'happyprime/toggle-block',
					{
						buttonText: attributes.label || attributes.title || '',
					},
					innerBlocks
				);
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['core/navigation-link'],
			transform: (attributes, innerBlocks) => {
				return createBlock(
					'core/navigation-link',
					{
						label: attributes.buttonText || '',
						url: '#',
					},
					innerBlocks
				);
			},
		},
	],
};
registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	transforms: Transforms,
});
