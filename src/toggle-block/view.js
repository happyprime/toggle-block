{
	/**
	 * Returns every toggle that controls the element with the given ID.
	 *
	 * @param {string} controlsId The controlled element's ID.
	 * @returns {NodeList} The toggles.
	 */
	const getControllingToggles = (controlsId) =>
		document.querySelectorAll(
			`.wp-block-happyprime-toggle-block[aria-controls="${CSS.escape(controlsId)}"]`
		);

	/**
	 * Returns the body classes a toggle sets while its block is open.
	 *
	 * The value can hold several space-separated classes, which classList
	 * rejects as a single token.
	 *
	 * @param {HTMLElement} toggle The toggle button element.
	 * @returns {string[]} The class names.
	 */
	const getBodyClasses = (toggle) =>
		(toggle.getAttribute('data-body-class') || '')
			.split(/\s+/)
			.filter(Boolean);

	/**
	 * Toggle a block on (show its controlled element).
	 *
	 * @param {HTMLElement} toggle The toggle button element.
	 */
	const toggleOn = (toggle) => {
		const controlsId = toggle.getAttribute('aria-controls');

		if (!controlsId) {
			return;
		}

		const toggledBlock = document.getElementById(controlsId);

		if (!toggledBlock) {
			return;
		}

		const bodyClasses = getBodyClasses(toggle);

		if (!toggle.classList.contains('toggle-block-has-toggled')) {
			toggle.classList.add('toggle-block-has-toggled');
		}

		if (!toggledBlock.classList.contains('toggle-block-has-been-toggled')) {
			toggledBlock.classList.add('toggle-block-has-been-toggled');
		}

		getControllingToggles(controlsId).forEach((el) =>
			el.setAttribute('aria-expanded', 'true')
		);
		toggledBlock.classList.remove('toggle-block-hidden');

		document.body.classList.add(...bodyClasses);
	};

	/**
	 * Toggle a block off (hide its controlled element).
	 *
	 * @param {HTMLElement} toggle The toggle button element.
	 */
	const toggleOff = (toggle) => {
		const controlsId = toggle.getAttribute('aria-controls');

		if (!controlsId) {
			return;
		}

		const toggledBlock = document.getElementById(controlsId);

		if (!toggledBlock) {
			return;
		}

		const bodyClasses = getBodyClasses(toggle);

		getControllingToggles(controlsId).forEach((el) =>
			el.setAttribute('aria-expanded', 'false')
		);
		toggledBlock.classList.add('toggle-block-hidden');

		document.body.classList.remove(...bodyClasses);
	};

	/**
	 * Get the toggle group parent, if any.
	 *
	 * @param {HTMLElement} toggle The toggle button element.
	 * @returns {HTMLElement|null} The toggle group parent or null.
	 */
	const getToggleGroup = (toggle) => {
		return toggle.closest('.toggle-block-group');
	};

	/**
	 * Get all toggle blocks within a toggle group.
	 *
	 * @param {HTMLElement} group The toggle group element.
	 * @returns {NodeList} The toggle blocks within the group.
	 */
	const getGroupToggles = (group) => {
		return group.querySelectorAll('.wp-block-happyprime-toggle-block');
	};

	/**
	 * Find the default toggle within a group.
	 *
	 * @param {HTMLElement} group The toggle group element.
	 * @returns {HTMLElement|null} The default toggle or null.
	 */
	const getDefaultToggle = (group) => {
		return group.querySelector(
			'.wp-block-happyprime-toggle-block[data-default-toggle="true"]'
		);
	};

	/**
	 * Closes a toggle and, inside a group, reopens the group's default toggle.
	 *
	 * @param {HTMLElement} toggle The toggle button element.
	 */
	const closeToggle = (toggle) => {
		toggleOff(toggle);

		const group = getToggleGroup(toggle);
		const defaultToggle = group && getDefaultToggle(group);

		if (defaultToggle && defaultToggle !== toggle) {
			toggleOn(defaultToggle);
		}
	};

	const focusableSelector = [
		'a[href]',
		'button:not([disabled])',
		'input:not([disabled]):not([type="hidden"])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'summary',
		'iframe',
		'[tabindex]:not([tabindex="-1"])',
	].join(',');

	/**
	 * Moves focus to the first visible focusable element in a toggled block.
	 *
	 * Focus stays on the toggle when the block has nothing to focus.
	 *
	 * @param {HTMLElement} toggledBlock The toggled block.
	 * @param {HTMLElement} toggle       The toggle that opened the block.
	 */
	const focusToggledBlock = (toggledBlock, toggle) => {
		const target = Array.from(
			toggledBlock.querySelectorAll(focusableSelector)
		).find((el) => el !== toggle && el.getClientRects().length > 0);

		if (target) {
			target.focus();
		}
	};

	/**
	 * Moves focus to a toggle outside the toggled block that controls it.
	 *
	 * @param {HTMLElement} toggledBlock The toggled block.
	 */
	const focusToggle = (toggledBlock) => {
		const toggle = Array.from(getControllingToggles(toggledBlock.id)).find(
			(el) => !toggledBlock.contains(el)
		);

		if (toggle) {
			toggle.focus();
		}
	};

	const handleClick = (evt) => {
		const toggle = evt.target.closest('.wp-block-happyprime-toggle-block');

		if (!toggle) {
			return;
		}

		const controlsId = toggle.getAttribute('aria-controls');

		if (!controlsId) {
			return;
		}

		const toggledBlock = document.getElementById(controlsId);

		if (!toggledBlock) {
			return;
		}

		if (!toggledBlock.classList.contains('toggle-block-hidden')) {
			closeToggle(toggle);

			// A toggle inside the block it hides would leave focus on a
			// hidden element.
			if (toggledBlock.contains(toggle)) {
				focusToggle(toggledBlock);
			}

			return;
		}

		const group = getToggleGroup(toggle);

		if (group) {
			// In a group, toggling on closes others.
			getGroupToggles(group).forEach((otherToggle) => {
				if (otherToggle !== toggle) {
					toggleOff(otherToggle);
				}
			});
		}

		toggleOn(toggle);
		focusToggledBlock(toggledBlock, toggle);
	};

	/**
	 * Closes the open toggled block that holds focus when Escape is pressed.
	 *
	 * Focus returns to a toggle that controls the block.
	 *
	 * @param {KeyboardEvent} evt The keydown event.
	 */
	const handleKeydown = (evt) => {
		if (evt.key !== 'Escape' || evt.defaultPrevented) {
			return;
		}

		for (let el = document.activeElement; el; el = el.parentElement) {
			const toggles = el.id
				? Array.from(getControllingToggles(el.id))
				: [];
			const toggle = toggles.find((t) => !el.contains(t)) || toggles[0];

			if (toggle && !el.classList.contains('toggle-block-hidden')) {
				closeToggle(toggle);
				focusToggle(el);
				return;
			}
		}
	};

	const init = () => {
		document
			.querySelectorAll('.wp-block-happyprime-toggle-block')
			.forEach((el) => {
				const controlsId = el.getAttribute('aria-controls');

				if (!controlsId) {
					return;
				}

				const toggledBlock = document.getElementById(controlsId);

				if (!toggledBlock) {
					return;
				}

				const bodyClasses = getBodyClasses(el);

				if (toggledBlock.classList.contains('toggle-block-hidden')) {
					el.setAttribute('aria-expanded', 'false');

					document.body.classList.remove(...bodyClasses);
				} else {
					el.setAttribute('aria-expanded', 'true');

					document.body.classList.add(...bodyClasses);
				}

				el.addEventListener('click', handleClick);
			});

		// Initialize toggle groups: activate the default toggle in each group.
		document.querySelectorAll('.toggle-block-group').forEach((group) => {
			const toggles = getGroupToggles(group);
			const hasActiveToggle = Array.from(toggles).some((toggle) => {
				const cId = toggle.getAttribute('aria-controls');
				if (!cId) return false;
				const controlled = document.getElementById(cId);
				return (
					controlled &&
					!controlled.classList.contains('toggle-block-hidden')
				);
			});

			// If no toggle is already active, activate the default toggle.
			if (!hasActiveToggle) {
				const defaultToggle = getDefaultToggle(group);

				if (defaultToggle) {
					// Close all others first, then open the default.
					toggles.forEach((toggle) => {
						if (toggle !== defaultToggle) {
							toggleOff(toggle);
						}
					});

					toggleOn(defaultToggle);
				}
			}
		});

		document.addEventListener('keydown', handleKeydown);
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}
