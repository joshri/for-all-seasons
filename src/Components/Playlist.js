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
	console.log(props.userId);

	useEffect(() => {
		setSeason(props.playlist)
		console.log(season);
	}, [props]);

	//play function for links and player
	function play(track) {
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
		let id = ''
        let uris = [];
        // let data = `\"name\":\"${name}\",\"description\":\"A glorious playlist from Ying Yang Twins for all season\", \"private\":\"false\"`
        let data = JSON.stringify({"name": `${name}`, "description": "A glorious playlist from Ying Yang Twins for all seasons", "public": "false"});
        console.log(data)
        console.log(props.access)
		season.forEach((song) => uris.push(song.uri));
		
		//create playlist endpoint
		await fetch(`https://api.spotify.com/v1/users/${props.userId}/playlists`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
			body: data
		})
			.then((res) => res.json())
            .then(json => {
                async function setId() {
                id = await json.id
                }
                setId();
            })
			.catch((err) => console.log(err))
			.then(() => {
                console.log(id)
				//add playlist

				fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${props.access}`,
					},
					body: JSON.stringify(uris),
				}).then((res) => res.json())
            })
            .catch((err) => console.log(err));
            
	}

	return (
		<div style={{ backgroundColor: '#EDAEFF' }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '25vh',
					width: '90vw',
					margin: '5vw',
					border: '2px solid black',
					padding: '10px',
					borderRadius: '10px',
					background: background,
				}}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '80vw',
						marginTop: '10px',
					}}>
					<img
						alt='album cover'
						style={{ marginTop: '5px', maxHeight: '64px', maxWidth: '64px' }}
						src={currentlyPlaying.cover}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '90vw',

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
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '10px',
					}}>
					<button id='previous' onClick={playNextOrPrevious}>
						previous
					</button>
					<button onClick={pause}>pause</button>
					<button onClick={playerPlay}>play</button>
					<button id='next' onClick={playNextOrPrevious}>
						next
					</button>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: '10px',
					}}>
					<input
						type='range'
						min='0'
						max='100'
						step='10'
						value={volume}
						onChange={(event) => volumeCall(event)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '0px',
					}}>
					<button
						onClick={() => {
							setBackground(
								'linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)'
							);
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
			</div>
			<div
				style={{
					width: '90vw',
					marginLeft: '5vw',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<h1
						style={{
							fontSize: '200%',
							fontFamily: "'Sacramento', cursive",

							margin: '5px',
						}}>
						{seasonWord}
					</h1>
					<button style={{ fontSize: '14px' }} onClick={createPlaylist}>
						Save to Spotify
					</button>
				</div>
				<ListGroup
					style={{
						background: background,
						border: '2px solid black',
						borderRadius: '10px',
					}}>
					{season.map((track) => {
						return (
							<ListGroup.Item
								variant='flush'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									height: '7vh',
									background: 'transparent',
								}}>
								<h5 style={{ fontSize: '16px' }}>
									{track.seasonScore} - {track.name}
								</h5>
								<button
									onClick={() => {
										play(track);
									}}>
									Play
								</button>
							</ListGroup.Item>
						);
					})}
				</ListGroup>
			</div>
		</div>
	);
}

export default Playlist;
