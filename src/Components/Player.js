import React, { useState } from 'react';

function Player(props) {
	let [volume, setVolume] = useState(50);
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
	
	return (
		<div>
			<img src={props.currentlyPlaying.cover} />
			<h3>{props.currentlyPlaying.name}</h3>
			<ul>{props.currentlyPlaying.artists.map((x) => <li>{x.name}</li>)}</ul>

			<button onClick={pause}>pause</button>
			<input
				type='range'
				min='0'
				max='100'
				value={volume}
				onChange={(event) => volumeCall(event)}
			/>
		</div>
	);
}

export default Player;
