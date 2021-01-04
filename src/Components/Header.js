import React from 'react';

function Header(props) {
	return (
		<div>
			<h1>
				{props.artist.name || 'Ying Yang Twins'} <span> - for all seasons</span>
			</h1>
		</div>
	);
}

export default Header;
