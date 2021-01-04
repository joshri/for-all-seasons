import React, { useState } from 'react';
import About from './About';

function ArtistForm(props) {
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	let formArtist = '';

	const loadArtist = (event) => {
		event.preventDefault();
		fetch(`https://api.spotify.com/v1/search?q=${formArtist}&type=artist`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				props.setArtist(json.artists.items[0]);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div>
			<About show={show} handleClose={handleClose} />
			<div className='artistform'>
				<form onSubmit={loadArtist}>
					<label htmlFor='artist'>Artist:</label>
					<input
						id='artist'
						type='text'
						placeholder='Ying Yang Twins'
						onChange={(event) => (formArtist = event.target.value)}
					/>
					<button type='submit'>search</button>
				</form>
				<button onClick={handleShow}>about</button>
			</div>
		</div>
	);
}

export default ArtistForm;
