<?php
/**
 * Manage the block.
 *
 * @package toggle-block
 */

namespace ToggleBlock\Block;

add_action( 'init', __NAMESPACE__ . '\register' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\alter_view_script' );

/**
 * Register the block.
 */
function register() {
	register_block_type_from_metadata( TOGGLE_BLOCK_PLUGIN_DIR . '/build' );
}

/**
 * Ensure the block's view script is output in document footer.
 */
function alter_view_script() {
	$asset_data = require TOGGLE_BLOCK_PLUGIN_DIR . '/build/view.asset.php';

	wp_register_script(
		'happyprime-toggle-block-view-script',
		plugins_url( 'build/view.js', TOGGLE_BLOCK_PLUGIN_FILE ),
		$asset_data['dependencies'],
		$asset_data['version'],
		true
	);
}
