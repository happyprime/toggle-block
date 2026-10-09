<?php
/**
 * Seeds demo content for local Toggle Block testing.
 *
 * Run with `npm run env:seed`. It is safe to run more than once.
 *
 * @package toggle-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Creates or updates a published page and returns its ID.
 *
 * @param string $slug    Page slug.
 * @param string $title   Page title.
 * @param string $content Block markup.
 * @return int Page ID, or zero on failure.
 */
function toggle_block_dev_upsert_page( string $slug, string $title, string $content ): int {
	$page = get_page_by_path( $slug );

	$args = [
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => $slug,
		'post_title'   => $title,
		// wp_insert_post() unslashes, which would break quotes in block attribute JSON.
		'post_content' => wp_slash( $content ),
	];

	if ( $page ) {
		$args['ID'] = $page->ID;
	}

	$page_id = wp_insert_post( $args, true );

	return is_wp_error( $page_id ) ? 0 : (int) $page_id;
}

switch_theme( 'twentytwentyfive' );

update_option( 'permalink_structure', '/%postname%/' );
flush_rewrite_rules( false );

$toggle_block_demo_id = toggle_block_dev_upsert_page(
	'toggle-block-demo',
	'Toggle Block demo',
	(string) file_get_contents( __DIR__ . '/demo.html' ) // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file.
);

$toggle_block_nav_id = toggle_block_dev_upsert_page(
	'toggle-block-navigation',
	'Toggle Block in navigation',
	(string) file_get_contents( __DIR__ . '/navigation.html' ) // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file.
);

if ( $toggle_block_demo_id ) {
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $toggle_block_demo_id );
}

WP_CLI::success( sprintf( 'Seeded demo page %d and navigation page %d.', $toggle_block_demo_id, $toggle_block_nav_id ) );
