import React from 'react';
import ArtistForm from './ArtistForm';

function Header(props) {
	return (
		<div className='header-container'>
			<div className='header-title'>
				<h1 className='header'>{props.artist.name || 'Ying Yang Twins'}</h1>
				<p className='header-seasons'> - for all seasons</p>
			</div>
			<ArtistForm access={props.access} setArtist={props.setArtist} />
		</div>
	);
}

export default Header;
