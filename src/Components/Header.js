import React from 'react';
import ArtistForm from './ArtistForm';

function Header(props) {
	return (
		<div
			style={{
				// position: 'fixed',
				height: '15vh',
				width: '100vw',
				marginBottom: '10px',
				backgroundColor: '#CEB0D6',
				borderBottom: '2px solid black',
			}}>
			<h1
				style={{
					fontSize: '200%',
					fontFamily: "'Sacramento', cursive",
					padding: '10px',
					margin: 0,
				}}>
				{props.artist.name || 'Ying Yang Twins'}{' '}
				<span
					style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '16px' }}>
					{' '}
					- for all seasons
				</span>
			</h1>

			<ArtistForm access={props.access} setArtist={props.setArtist} />
		</div>
	);
}

export default Header;
