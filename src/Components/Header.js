import React from 'react';
import ArtistForm from './ArtistForm'


function Header(props) {
        return (
					<div>
						<h1>{props.artist.name || 'Ying Yang Twins'}: For All Seasons</h1>
						<ArtistForm access={props.access} setArtist={props.setArtist}/>
					</div>
				);
    }

export default Header;