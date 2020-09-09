import React from 'react';


function Header(props) {
        return (
					<div>
							<h1>{props.artist.name || 'Ying Yang Twins'}: For All Seasons</h1>
					</div>
				);
    }

export default Header;