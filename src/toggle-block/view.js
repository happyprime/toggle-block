{
	const handleClick = (evt) => {
		const controlsId = evt.target.getAttribute('aria-controls');

		if (!controlsId) {
			return;
		}

		const toggledBlock = document.getElementById(controlsId);

		if (!toggledBlock) {
			return;
		}

		const bodyClass = evt.target.getAttribute('data-body-class');

		// Add a persisting class to the toggle button when it is
		// clicked for the first time to flag that it has, at one
		// point in its history, been toggled.
		if (!evt.target.classList.contains('toggle-block-has-toggled')) {
			evt.target.classList.add('toggle-block-has-toggled');
		}

		/**
		 * Add a persisting class to the toggled block when it is
		 * toggled for the first time to flag that it has, at one
		 * point in its history, been toggled.
		 */
		if (!toggledBlock.classList.contains('toggle-block-has-been-toggled')) {
			toggledBlock.classList.add('toggle-block-has-been-toggled');
		}

		if (toggledBlock.classList.contains('toggle-block-hidden')) {
			evt.target.setAttribute('aria-pressed', 'true');
			evt.target.setAttribute('aria-expanded', 'true');
			toggledBlock.classList.remove('toggle-block-hidden');

			if (bodyClass) {
				document.body.classList.add(bodyClass);
			}
		} else {
			evt.target.setAttribute('aria-pressed', 'false');
			evt.target.setAttribute('aria-expanded', 'false');
			toggledBlock.classList.add('toggle-block-hidden');

			if (bodyClass) {
				document.body.classList.remove(bodyClass);
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
	});
}
