<?php
/**
 * Plugin Name:  Toggle Block
 * Description:  Add a toggle to show and hide another block.
 * Version:      0.3.1
 * Plugin URI:   https://github.com/happyprime/toggle-block/
 * Author:       Happy Prime
 * Author URI:   https://happyprime.co
 * Text Domain:  toggle-block
 * Requires PHP: 7.4
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * @package toggle-block
 */

namespace ToggleBlock;

define( 'TOGGLE_BLOCK_PLUGIN_DIR', __DIR__ );
define( 'TOGGLE_BLOCK_PLUGIN_FILE', __FILE__ );

require_once __DIR__ . '/src/index.php';
