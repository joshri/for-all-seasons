import React, { useState, useEffect } from 'react';
import About from './About';

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
		<div
			style={{
				marginBottom: '10px',
				marginTop: '5vh',
				borderBottom: '2px solid black',
				borderTop: '2px solid black',
			}}>
			<About show={show} handleClose={handleClose} />
			<div
				className='artistform'
				style={{
					margin: '10px 10px 10px 10px',
					display: 'flex',
					justifyContent: '',
				}}>
				<form onSubmit={loadArtist}>
					<label for='artist'>Artist:</label>
					<input
						style={{
							height: '3.5vh',
							width: '30vw',
							backgroundColor: '#CEB0D6',
							border: '2px solid black',
							borderRadius: '10px',
							marginBottom: '10px',
						}}
						id='artist'
						type='text'
						placeholder=' Ying Yang Twins'
						onChange={(event) => (formArtist = event.target.value)}
					/>
					<button
						style={{
							height: '4vh',
							width: '10vw',
							marginLeft: '0px',
							alignItems: 'center',
							backgroundColor: 'transparent',
							fontSize: '14px',
							textDecoration: 'underline',
						}}
						type='submit'>
						search
					</button>
				</form>

				<button
					onClick={handleShow}
					style={{
						height: '4vh',
						alignItems: 'center',
						backgroundColor: 'transparent',
						fontSize: '14px',
						marginLeft: '10vw',
						textDecoration: 'underline',
					}}>
					about
				</button>
			</div>
		</div>
	);
}

export default ArtistForm;
