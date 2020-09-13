import React, { useState, useEffect } from 'react';
import About from './About'

function ArtistForm(props) {
    const [show, setShow] = useState(false);
   const handleShow = () => setShow(true);
   const handleClose = () => setShow(false);
	let formArtist = '';

	const loadArtist = (event) => {
		event.preventDefault();
		//pause playback in case song is playing
		fetch(`https://api.spotify.com/v1/search?q=${formArtist}&type=artist`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				props.setArtist(json.artists.items[0]);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div>
			<About show={show} handleClose={handleClose} />
			<div
				style={{
					margin: '10px 10px 10px 10px',
					display: 'flex',
					justifyContent: 'space-between',
				}}>
				<form onSubmit={loadArtist}>
					<label for='artist'>Artist:</label>
					<input
						style={{
							height: '4vh',
							width: '40vw',
							backgroundColor: '#DCDFDE',
						}}
						id='artist'
						type='text'
						placeholder='Ying Yang Twins'
						onChange={(event) => (formArtist = event.target.value)}
					/>
					<button
						style={{
							height: '4vh',
							width: '20vw',
							marginLeft: '5px',
							alignItems: 'center',
							backgroundColor: 'transparent',
							fontSize: '14px',
						}}
						type='submit'>
						submit
					</button>
				</form>
				<button
					onClick={handleShow}
					style={{
						height: '4vh',
						alignItems: 'center',
						backgroundColor: 'transparent',
						fontSize: '14px',
					}}>
					about
				</button>
			</div>
		</div>
	);
}

export default ArtistForm;
