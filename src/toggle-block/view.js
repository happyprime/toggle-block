{
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

		const bodyClass = toggle.getAttribute('data-body-class');

		if (!toggle.classList.contains('toggle-block-has-toggled')) {
			toggle.classList.add('toggle-block-has-toggled');
		}

		if (!toggledBlock.classList.contains('toggle-block-has-been-toggled')) {
			toggledBlock.classList.add('toggle-block-has-been-toggled');
		}

		toggle.setAttribute('aria-pressed', 'true');
		toggle.setAttribute('aria-expanded', 'true');
		toggledBlock.classList.remove('toggle-block-hidden');

		if (bodyClass) {
			document.body.classList.add(bodyClass);
		}
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

		const bodyClass = toggle.getAttribute('data-body-class');

		toggle.setAttribute('aria-pressed', 'false');
		toggle.setAttribute('aria-expanded', 'false');
		toggledBlock.classList.add('toggle-block-hidden');

		if (bodyClass) {
			document.body.classList.remove(bodyClass);
		}
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

		const group = getToggleGroup(toggle);
		const isCurrentlyOpen = !toggledBlock.classList.contains(
			'toggle-block-hidden'
		);

		if (group) {
			// In a group, toggling on closes others.
			if (!isCurrentlyOpen) {
				// Close all other toggles in the group.
				getGroupToggles(group).forEach((otherToggle) => {
					if (otherToggle !== toggle) {
						toggleOff(otherToggle);
					}
				});

				// Open this toggle.
				toggleOn(toggle);
			} else {
				// Closing the active toggle in a group.
				toggleOff(toggle);

				// If there's a default toggle and it's not this one,
				// activate it.
				const defaultToggle = getDefaultToggle(group);

				if (defaultToggle && defaultToggle !== toggle) {
					toggleOn(defaultToggle);
				}
			}
		} else {
			// Not in a group, original toggle behavior.
			if (!isCurrentlyOpen) {
				toggleOn(toggle);
			} else {
				toggleOff(toggle);
			}
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
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

				const bodyClass = el.getAttribute('data-body-class');

				if (toggledBlock.classList.contains('toggle-block-hidden')) {
					el.setAttribute('aria-pressed', 'false');
					el.setAttribute('aria-expanded', 'false');

					if (bodyClass) {
						document.body.classList.remove(bodyClass);
					}
				} else {
					el.setAttribute('aria-pressed', 'true');
					el.setAttribute('aria-expanded', 'true');

					if (bodyClass) {
						document.body.classList.add(bodyClass);
					}
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
	});
}
