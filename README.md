# Toggle Block

Add a toggle in the block editor to show and hide another block.

## Description

Toggle Block is a very rudimentary block. It renders as a `<button>` element on the front-end that is used to show or hide another target element (via its ID) on the page. It uses `aria-controls` and `aria-label` in an attempt to make it compatible with assistive technology.

The intended use is in a site's template, through the site editor or your theme files, rather than as a block that is frequently used in content.

## Development

Requires Docker and Node 24.

```sh
npm install
composer install
npm run env:start
```

`env:start` builds the block, starts WordPress 7.1 at http://localhost:8980 (log in at `/wp-admin` as `admin` / `password`), and runs `env:seed`. The seed activates Twenty Twenty-Five, turns on pretty permalinks, and creates two pages:

* **Toggle Block demo** (the front page): hidden and visible targets, screen reader text, a toggle group with a default toggle, a body class toggle, and open and close buttons for one panel.
* **Toggle Block in navigation**: a toggle inside a Navigation block.

`npm run env:stop` stops the site and `npm run env:destroy` removes it.

Checks:

```sh
composer phpcs
composer phpstan
npm run lint:js
npm run lint:css
npm run lint:package
npm run build
```

## Changelog

### 1.0.0

* Initial WP.org release.
* Add block selection interface.
* Add additional block supports: background image, background size, text align, shadow, and writing mode.
* Update to latest dependencies, build process, and code standards.

### 0.6.0

* Add toggle group support: when toggle blocks are inside a container with the `toggle-block-group` class, activating one toggle automatically closes others in the group.
* Add a "Default toggle" option to mark which toggle should be active by default in a group.
* Extend block supports to match paragraph and heading blocks: add font family, font style, font weight, letter spacing, text decoration, text transform, writing mode, border, and link color support.
* Only render `aria-label` when screen reader text is provided, allowing the button text to serve as the accessible name by default.
* Use `aria-expanded` instead of both `aria-pressed` and `aria-expanded` for toggle state.
* Update to latest dependencies, build process, and code standards.

### 0.5.0

* Wrap button text in a `<span>` element to help with styling.
* Move editor styles to an editor-only stylesheet.
* Update to latest dependencies, build process, and code standards.

### 0.4.0

* Add an attribute to toggle a toggle block-specific class on the body element.
* Allow the toggle block to be placed inside the `core/navigation` block.
* Add transform support from/to `core/navigation-link` blocks.
* Update to latest dependencies, build process, and code standards.

### 0.3.1

* Add persisting `toggle-block-has-been-toggled` class to toggled element when first toggled.

### 0.3.0

* Add persisting `toggle-block-has-toggled` class to toggle button when first clicked.
* Update `@wordpress/scripts` to 27.7.0.
* Update project dependencies.
