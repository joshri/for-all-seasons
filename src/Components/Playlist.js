import React, { useState } from 'react';

function Playlist(props) {
	let [volume, setVolume] = useState(50);
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: 'Click Play on a Song!!',
		cover: 'https://i.scdn.co/image/b434cb66ee3b358bd1707bce3e7371f158184f8c',
		artists: ['Ying Yang Twins'],
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
		).catch((err) => console.log(err));
	}
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
	function getPlaying() {
		fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				let playing = { uri: json.item.uri, isPlaying: json.is_playing };
				return playing;
			});
	}

	function playNextOrPrevious(event) {
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
				let playing = { uri: json.item.uri, isPlaying: json.is_playing };

				let next = '';
				let previous = '';
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

	return (
		<div>
			<div>
				<img src={currentlyPlaying.cover} />
				<h3>{currentlyPlaying.name}</h3>
				<ul>
					{currentlyPlaying.artists.map((x) => (
						<li>{x.name}</li>
					))}
				</ul>

				<button onClick={pause}>pause</button>
				<button id='next' onClick={playNextOrPrevious}>
					next
				</button>
				<button id='previous' onClick={playNextOrPrevious}>
					previous
				</button>
				<input
					type='range'
					min='0'
					max='100'
					value={volume}
					onChange={(event) => volumeCall(event)}
				/>
			</div>

			<main>
				{props.playlist.map((track) => {
					return (
						<div>
							<h5>{track.name}</h5>
							<button
								onClick={() => {
									play(track);
								}}>
								Play
							</button>
						</div>
					);
				})}
			</main>
		</div>
	);
}

export default Playlist;
