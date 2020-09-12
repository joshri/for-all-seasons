import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function Playlist(props) {
	let [volume, setVolume] = useState(50);
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: 'Click Play on a Song!!',
		cover: 'https://i.scdn.co/image/f57a69bfb8aef58b2b2cee85cb82eddab8daeca1',
		artists: [{ name: 'Ying Yang Twins' }],
	});

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
				for (let i = 0; i < props.playlist.length; i++) {
					if (props.playlist[i].uri === playing.uri) {
						next = props.playlist[i + 1];
						previous = props.playlist[i - 1];
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

	return (
		<div>
			<div
				style={{
					height: '20vh',
					width: '90vw',
					margin: '10px',
				}}>
				<div style={{ display: 'flex', marginLeft: '5px', width: '100vw' }}>
					<img src={currentlyPlaying.cover} />
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '100vw',
							marginLeft: '5px',
							alignItems: 'center',
						}}>
						<h3 style={{ fontSize: '16px' }}>{currentlyPlaying.name}</h3>
						<div
							style={{
								display: 'flex',
								alignItems: 'space-between',
								overflow: 'scroll',
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
			</div>
			<div style={{}}>
				<ListGroup
					style={{ background: 'linear-gradient(#FF7B2A, #F2FD89, #F4FFDB)' }}>
					{props.playlist.map((track) => {
						return (
							<ListGroup.Item
								variant='flush'
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									height: '7.5vh',
									background: 'transparent',
								}}>
								<h5 style={{ fontSize: '16px' }}>
									{track.seasonScore} {track.name}
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
