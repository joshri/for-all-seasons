import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function Playlist(props) {
	let [volume, setVolume] = useState(50);
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: 'Click Play on a Song!!',
		cover: 'https://i.scdn.co/image/f57a69bfb8aef58b2b2cee85cb82eddab8daeca1',
		artists: [{ name: 'Ying Yang Twins' }],
	});
	// let [playlist, setPlaylist] = useState(props.playlist);
	let seasonInterval = Math.floor(props.playlist.length / 4);
	let [season, setSeason] = useState(props.playlist);
	let [background, setBackground] = useState(
		'linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)'
	);
	let [seasonWord, setSeasonWord] = useState('All Seasons');
	// let [playing, setPlaying] = useState(false)
	let artist = props.artist;

	useEffect(() => {
		if (artist !== props.artist) {
			setSeasonWord('All Seasons');
			setBackground('linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)');
			artist = props.artist;
		}
		setSeason(props.playlist);
	}, [props]);

	//play function for links and player
	function play(track) {
		//this doesnt solve double playback bug
		// if (playing) {
		//     pause()
		// }
		setCurrentlyPlaying({
			name: track.name,
			cover: track.cover.url,
			artists: track.artists.map((x) => x),
		});
		fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
				body: JSON.stringify({ uris: [track.uri] }),
			}
		);
		// setPlaying(true)
	}

	//self-explanatory pause function for player
	function pause() {
		fetch(
			`https://api.spotify.com/v1/me/player/pause?device_id=${props.playerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
			}
		);
	}
	//sets volume using state and onChange (this does a lot of API calls)
	function volumeCall(event) {
		setVolume(event.target.value);
		fetch(
			`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${props.playerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
			}
		);
	}
	//special play function to resume play if paused
	function playerPlay() {
		fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				//won't do anything if something is playing
				if (json.is_playing === true) {
					return;
				} else {
					fetch(
						`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
						{
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${props.access}`,
							},
							body: JSON.stringify({
								uris: [json.item.uri],
								//uses ms value from currently playing obj
								position_ms: json.progress_ms,
							}),
						}
					).catch((err) => console.log(err));
				}
			});
	}

	//skips one item backwards or forwards in playlist array
	function playNextOrPrevious(event) {
		//lets button id stay through fetch
		event.persist();
		fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				let playing = { uri: json.item.uri };
				let next = '';
				let previous = '';
				//use uri that's currently playing to search for current index in playlist
				for (let i = 0; i < season.length; i++) {
					if (season[i].uri === playing.uri) {
						next = season[i + 1];
						previous = season[i - 1];
						break;
					}
				}
				if (event.target.id === 'next') {
					play(next);
				} else if (event.target.id === 'previous') {
					play(previous);
				}
			});
	}
	//TODO: separate into player component again

	async function createPlaylist() {
		//setup
		let name = `${props.artist.name} - ${seasonWord}`;
		let id = '';
		let uris = [];
		// let data = `\"name\":\"${name}\",\"description\":\"A glorious playlist from Ying Yang Twins for all season\", \"private\":\"false\"`
		let data = JSON.stringify({
			name: `${name}`,
			description: 'A glorious playlist from Ying Yang Twins for all seasons',
			public: 'false',
		});
		console.log(data);
		console.log(props.access);
		season.forEach((song) => uris.push(song.uri));

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
				console.log(id);
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

	return (
		<div
			style={{
				backgroundColor: '#EDAEFF',
				alignItems: 'center',
				justifyContent: 'center',
				display: 'flex',
				flexDirection: 'column',
			}}>
			<div
				style={{
					display: 'flex',

					width: '90vw',
					margin: '5vw',
					justifyContent: 'space-between',
					alignItems: 'center',
					maxWidth: '600px',
					border: '2px solid black',
					padding: '10px',
					borderRadius: '10px',
					background: background,
				}}>
				<img
					style={{
						marginTop: '5px',
						height: '128px',
						width: '128px',
						ObjectFit: 'cover',
					}}
					src={currentlyPlaying.cover}
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '80vw',

						alignItems: 'center',
					}}>
					<h3 style={{ fontSize: '16px' }}>{currentlyPlaying.name}</h3>
					<div
						style={{
							display: 'flex',
							alignItems: 'space-evenly',
							flexWrap: 'wrap',
						}}>
						{currentlyPlaying.artists.map((x) => (
							<p style={{ fontSize: '14px' }}>{x.name}</p>
						))}
					</div>

					<div style={{ display: 'flex' }}>
						<button>
							<svg
								id='previous'
								onClick={playNextOrPrevious}
								width='1.5em'
								height='1.5em'
								viewBox='0 0 16 16'
								class='bi bi-arrow-90deg-left'
								fill='currentColor'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									fill-rule='evenodd'
									d='M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z'
								/>
							</svg>
						</button>
						<button>
							<svg
								onClick={pause}
								width='1.5em'
								height='1.5em'
								viewBox='0 0 16 16'
								class='bi bi-pause'
								fill='currentColor'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									fill-rule='evenodd'
									d='M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z'
								/>
							</svg>
						</button>
						<button>
							<svg
								onClick={playerPlay}
								width='1.5em'
								height='1.5em'
								viewBox='0 0 16 16'
								class='bi bi-play'
								fill='currentColor'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									fill-rule='evenodd'
									d='M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'
								/>
							</svg>
						</button>
						<button>
							<svg
								id='next'
								onClick={playNextOrPrevious}
								width='1.5em'
								height='1.5em'
								viewBox='0 0 16 16'
								class='bi bi-arrow-90deg-right'
								fill='currentColor'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									fill-rule='evenodd'
									d='M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4z'
								/>
							</svg>
						</button>
					</div>

					<input
						type='range'
						min='0'
						max='100'
						step='10'
						value={volume}
						onChange={(event) => volumeCall(event)}
					/>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					textDecoration: 'underline',
					borderBottom: '2px solid black',
					borderTop: '2px solid black',
					width: '100vw',
					marginBottom: '2vh',
					marginTop: '10px',
				}}>
				<button
					onClick={() => {
						setBackground('linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)');
						setSeason(props.playlist);
						setSeasonWord('All Seasons');
					}}>
					all
				</button>

				<button
					onClick={() => {
						setSeason(props.playlist.slice(0, seasonInterval));
						setBackground('linear-gradient(#FF5629, #FFFFFF)');
						setSeasonWord('Summer');
					}}>
					summer
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#FF9129 , #FFFFFF)');
						setSeason(
							props.playlist.slice(seasonInterval, seasonInterval * 2 + 1)
						);
						setSeasonWord('Spring');
					}}>
					spring
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#F2FD89, #FFFFFF)');

						setSeason(
							props.playlist.slice(seasonInterval * 2, seasonInterval * 3 + 1)
						);
						setSeasonWord('Fall');
					}}>
					fall
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#6CFFDB, #FFFFFF)');
						setSeason(props.playlist.slice(seasonInterval * 3));
						setSeasonWord('Winter');
					}}>
					winter
				</button>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '90vw',
					maxWidth: '600px',
					marginLeft: '5vw',
					marginRight: '5vw',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						maxWidth: '600px',
					}}>
					<h1
						style={{
							fontSize: '2.5rem',
							fontFamily: "'Sacramento', cursive",

							margin: '5px',
						}}>
						{seasonWord}
					</h1>
					<button
						style={{ fontSize: '14px', marginBottom: '12.5px' }}
						onClick={createPlaylist}>
						Save to Spotify
					</button>
				</div>
				<div style={{ maxWidth: '600px', width: '90vw' }}>
					<ListGroup
						style={{
							background: background,
							border: '2px solid black',
							borderRadius: '10px',
						}}>
						{season.map((track) => {
							return (
								<ListGroup.Item
									onClick={() => {
										play(track);
									}}
									variant='flush'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										height: '7vh',
										background: 'transparent',
									}}>
									<h5 style={{ fontSize: '12px' }}>
										{track.seasonScore} - {track.name}
									</h5>
									<button
										style={{ borderBottom: 'none' }}
										onClick={() => {
											play(track);
										}}>
										<svg
											width='1.5em'
											height='1.5em'
											viewBox='0 0 16 16'
											class='bi bi-play'
											fill='currentColor'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												fill-rule='evenodd'
												d='M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'
											/>
										</svg>
									</button>
								</ListGroup.Item>
							);
						})}
					</ListGroup>
				</div>
			</div>
		</div>
	);
}

export default Playlist;
