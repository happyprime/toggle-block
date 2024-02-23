// WordPress dependencies.
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies.
import metadata from './block.json';

const Edit = ( props ) => {
	const {
		attributes: { buttonText, controlsId, labelText },
		setAttributes,
	} = props;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Toggle settings', 'toggle-block' ) }>
					<TextControl
						label={ __( 'Controls ID', 'toggle-block' ) }
						description={ __(
							'Enter the HTML anchor ID of the element this toggle controls.',
							'toggle-block'
						) }
						value={ controlsId }
						onChange={ ( value ) =>
							setAttributes( { controlsId: value } )
						}
					/>
					<TextControl
						label={ __( 'Screen reader text', 'toggle-block' ) }
						description={ __(
							'Enter a description of what this toggle controls.',
							'toggle-block'
						) }
						value={ labelText }
						onChange={ ( value ) =>
							setAttributes( { labelText: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				{ ...useBlockProps() }
				tagName="span"
				label={ __( 'Button text', 'toggle-block' ) }
				placeholder={ __( 'Button text', 'toggle-block' ) }
				value={ buttonText }
				onChange={ ( value ) => {
					setAttributes( { buttonText: value } );
				} }
			/>
		</>
	);
};

const Save = ( props ) => {
	const {
		attributes: { buttonText, controlsId, labelText },
	} = props;

	return (
		<button
			{ ...useBlockProps.save() }
			aria-label={ labelText }
			aria-controls={ controlsId }
		>
			{ buttonText }
		</button>
	);
};

registerBlockType( metadata, {
	edit: Edit,
	save: Save,
} );
