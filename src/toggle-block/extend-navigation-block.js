import { addFilter } from '@wordpress/hooks';

/**
 * Add the toggle block to the list of allowed blocks in the navigation block.
 *
 * @param {object} settings Settings for the navigation block.
 * @param {string} name Name of the block.
 * @returns {object} Settings for the navigation block.
 */
function addToggleBlockToNavigation(settings, name) {
	if (name !== 'core/navigation') {
		return settings;
	}

	const allowedBlocks = settings.allowedBlocks || [];

	return {
		...settings,
		allowedBlocks: [...allowedBlocks, 'happyprime/toggle-block'],
	};
}

addFilter(
	'blocks.registerBlockType',
	'happyprime/add-toggle-to-navigation',
	addToggleBlockToNavigation
);
