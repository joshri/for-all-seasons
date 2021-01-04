import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

function SortAndSave(props) {
	let [alert, setAlert] = useState(false);
	let [seasonWord, setSeasonWord] = useState('All Seasons');
	let seasonInterval = Math.floor(props.original.length / 4);

	async function createPlaylist() {
		//setup
		let name = `${props.artist.name} - ${seasonWord}`;
		let id = '';
		let uris = [];
		let data = JSON.stringify({
			name: `${name}`,
			description: 'A glorious playlist from Ying Yang Twins for all seasons',
			public: 'false',
		});
		props.season.forEach((song) => uris.push(song.uri));

		//create playlist endpoint
		await fetch(`https://api.spotify.com/v1/users/${props.userId}/playlists`, {
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
        props.setBackground('linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)');
		setSeasonWord('All Seasons');
	});

	return (
		<div>
			<div>
				<button
					onClick={() => {
						props.setBackground('linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)');
						props.setSeason(props.original);
						setSeasonWord('All Seasons');
					}}>
					all
				</button>

				<button
					onClick={() => {
						props.setSeason(props.original.slice(0, seasonInterval));
						props.setBackground('linear-gradient(#FF5629, #FFFFFF)');
						setSeasonWord('Summer');
					}}>
					summer
				</button>
				<button
					onClick={() => {
						props.setBackground('linear-gradient(#F2FD89, #FFFFFF)');
						props.setSeason(
							props.original.slice(seasonInterval, seasonInterval * 2 + 1)
						);
						setSeasonWord('Spring');
					}}>
					spring
				</button>
				<button
					onClick={() => {
						props.setBackground('linear-gradient(#FF9129 , #FFFFFF)');
						props.setSeason(
							props.original.slice(seasonInterval * 2, seasonInterval * 3 + 1)
						);
						setSeasonWord('Fall');
					}}>
					fall
				</button>
				<button
					onClick={() => {
						props.setBackground('linear-gradient(#6CFFDB, #FFFFFF)');
						props.setSeason(props.original.slice(seasonInterval * 3));
						setSeasonWord('Winter');
					}}>
					winter
				</button>
			</div>
			<div>
				<div>
					<h1>{seasonWord}</h1>
					<button
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
