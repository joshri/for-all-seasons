import React from 'react';
import ArtistForm from './ArtistForm';

function Header(props) {
	return (
		<div className='header-container'>
			<h1 className='header'>
				{props.artist.name || 'Ying Yang Twins'} <span> - for all seasons</span>
			</h1>
			<ArtistForm access={props.access} setArtist={props.setArtist} />
		</div>
	);
}

export default Header;
