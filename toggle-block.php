<?php
/**
 * Plugin Name:  Toggle Block
 * Description:  Add a toggle to show and hide another block.
 * Version:      0.6.0
 * Plugin URI:   https://github.com/happyprime/toggle-block/
 * Author:       Happy Prime
 * Author URI:   https://happyprime.co
 * Text Domain:  toggle-block
 * Requires PHP: 7.4
 * Tested up to: 7.0
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * @package toggle-block
 */

namespace ToggleBlock;

add_action( 'init', __NAMESPACE__ . '\register' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\alter_view_script' );

/**
 * Register the block.
 */
function register(): void {
	register_block_type_from_metadata( __DIR__ . '/build/toggle-block' );
}

/**
 * Ensure the block's view script is output in document footer.
 */
function alter_view_script(): void {
	wp_deregister_script( 'happyprime-toggle-block-view-script' );

	wp_register_script(
		'happyprime-toggle-block-view-script',
		plugins_url( 'build/toggle-block/view.js', __FILE__ ),
		[],
		(string) filemtime( __DIR__ . '/build/toggle-block/view.js' ),
		true
	);
}
