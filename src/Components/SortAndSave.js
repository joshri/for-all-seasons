import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

function SortAndSave(props) {
	let artist = props.artist;
	let [alert, setAlert] = useState(false);
	let seasonInterval = Math.floor(props.original.length / 4);

	async function createPlaylist() {
		//setup
		let name = `${artist.name} - ${props.background}`;
		let userId = '';
		let id = '';
		let uris = [];
		let data = JSON.stringify({
			name: `${name}`,
			description: 'A glorious playlist from Ying Yang Twins for all seasons',
			public: 'false',
		});
		props.season.forEach((song) => uris.push(song.uri));

		await fetch('https://api.spotify.com/v1/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
		.then(res => res.json())
		.then(json => {
			userId = json.id
		});

		//create playlist endpoint
		await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
			body: data,
		})
			.then((res) => res.json())
			.then((json) => {
				async function setId() {
					id = await json.id;
				}
				setId();
			})
			.catch((err) => console.log(err))
			.then(() => {
				//add playlist
				fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${props.access}`,
					},
					body: JSON.stringify(uris),
				}).then((res) => res.json());
			})
			.catch((err) => console.log(err));
	}

	useEffect(() => {
		props.setBackground({
			0: '#EDAEFF',
			1: 'All Seasons',
		});
	}, [artist]);

	return (
		<div>
			<div className='selector'>
				<button
					onClick={() => {
						props.setBackground({
							0: '#EDAEFF',
							1: 'All Seasons',
						});
						props.setSeason(props.original);
					}}>
					all
				</button>

				<button
					onClick={() => {
						props.setSeason(props.original.slice(0, seasonInterval));
						props.setBackground({
							0: 'linear-gradient(to bottom right, yellow 10%, white)',
							1: 'Summer'});
					}}>
					summer
				</button>
				<button
					onClick={() => {
						props.setBackground({
							0: 'yellow',
							1: 'Spring'});
						props.setSeason(
							props.original.slice(seasonInterval, seasonInterval * 2 + 1)
						);
					}}>
					spring
				</button>
				<button
					onClick={() => {
						props.setBackground({
							0: 'orange',
							1: 'Fall'});
						props.setSeason(
							props.original.slice(seasonInterval * 2, seasonInterval * 3 + 1)
						);
					}}>
					fall
				</button>
				<button
					onClick={() => {
						props.setBackground({
							0: 'lightblue',
							1: 'Winter'});
						props.setSeason(props.original.slice(seasonInterval * 3));
					}}>
					winter
				</button>
			</div>
			<div>
				<div>
					<h1 className='season-word'>{props.background[1]}</h1>
					<button className='playlist-save'
						onClick={() => {
							createPlaylist();
							setAlert(true);
						}}>
						Save to Spotify
					</button>
				</div>

				{alert ? (
					<Alert variant='success' onClose={() => setAlert(false)} dismissible>
						<h3>SAVED</h3>
					</Alert>
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
}

export default SortAndSave;
