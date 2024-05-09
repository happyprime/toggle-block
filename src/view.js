{
	const handleClick = ( evt ) => {
		const controlsId = evt.target.getAttribute( 'aria-controls' );

		if ( ! controlsId ) {
			return;
		}

		const toggledBlock = document.getElementById( controlsId );

		if ( ! toggledBlock ) {
			return;
		}

		// Add a persisting class to the toggle button when it is
		// clicked for the first time to flag that it has, at one
		// point in its history, been toggled.
		if ( ! evt.target.classList.contains( 'toggle-block-has-toggled' ) ) {
			evt.target.classList.add( 'toggle-block-has-toggled' );
		}

		if ( toggledBlock.classList.contains( 'toggle-block-hidden' ) ) {
			evt.target.setAttribute( 'aria-pressed', 'true' );
			evt.target.setAttribute( 'aria-expanded', 'true' );
			toggledBlock.classList.remove( 'toggle-block-hidden' );
		} else {
			evt.target.setAttribute( 'aria-pressed', 'false' );
			evt.target.setAttribute( 'aria-expanded', 'false' );
			toggledBlock.classList.add( 'toggle-block-hidden' );
		}
	};

	document.addEventListener( 'DOMContentLoaded', () => {
		document
			.querySelectorAll( '.wp-block-happyprime-toggle-block' )
			.forEach( ( el ) => {
				const controlsId = el.getAttribute( 'aria-controls' );

				if ( ! controlsId ) {
					return;
				}

				const toggledBlock = document.getElementById( controlsId );

				if ( ! toggledBlock ) {
					return;
				}

				if (
					toggledBlock.classList.contains( 'toggle-block-hidden' )
				) {
					el.setAttribute( 'aria-pressed', 'false' );
					el.setAttribute( 'aria-expanded', 'false' );
				} else {
					el.setAttribute( 'aria-pressed', 'true' );
					el.setAttribute( 'aria-expanded', 'true' );
				}

				el.addEventListener( 'click', handleClick );
			} );
	} );
}
