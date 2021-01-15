import React, { useState, useEffect } from 'react';

function Player(props) {
	let [volume, setVolume] = useState(50);
	let [pauseSwitch, setPauseSwitch] = useState('none');
	let [playSwitch, setPlaySwitch] = useState('block');

	// useEffect(() => {
	// 	pause();
	// });

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
		let newVol = event.target.value;
		setVolume(event.target.value);
		fetch(
			`https://api.spotify.com/v1/me/player/volume?volume_percent=${newVol}&device_id=${props.playerId}`,
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
			.catch((err) => console.log(err))
			.then((json) => {
				//won't do anything if something is playing
				if (!json || json.is_playing === true) {
					return;
				}
				fetch(
					`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${props.access}`,
						},
					}
				);
			});
		setPauseSwitch(0);
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
			.catch((err) => console.log(err))
			.then((json) => {
				if (!json) {
					return;
				}
				let playing = { uri: json.item.uri };
				let next = '';
				let previous = '';
				//use uri that's currently playing to search for current index in playlist
				for (let i = 0; i < props.season.length; i++) {
					if (props.season[i].uri === playing.uri) {
						next = props.season[i + 1];
						previous = props.season[i - 1];
						break;
					}
				}
				if (event.target.id === 'next') {
					props.play(next);
				} else if (event.target.id === 'previous') {
					props.play(previous);
				}
			})
			.catch((err) => console.log(err));
	}

	return (
		<div className='player-container'>
			<div className='player-track'>
				<img alt='album cover' src={props.currentlyPlaying.cover} />
				<div style={{flexDirection: 'column'}}>
					<h3>{props.currentlyPlaying.name}</h3>
					<p>
						{props.currentlyPlaying.artists.map((x) => '- ' + x.name + ' - ')}
					</p>
				</div>
			</div>
			<div className='player-controls'>
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
				<button style={{ display: playSwitch }}>
					<svg
						onClick={() => {
							pause();
							setPauseSwitch('block');
							setPlaySwitch('none');
						}}
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
				<button style={{ display: pauseSwitch }}>
					<svg
						onClick={() => {
							playerPlay();
							setPlaySwitch('block');
							setPauseSwitch('none');
						}}
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
				defaultValue={volume}
				onInput={(event) => volumeCall(event)}
			/>
		</div>
	);
}

export default Player;
