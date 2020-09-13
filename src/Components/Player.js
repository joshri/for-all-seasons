import React, {useState} from 'react';

function Player(props) {
    let [volume, setVolume] = useState(50);
		let [currentlyPlaying, setCurrentlyPlaying] = useState({
			name: 'Click Play on a Song!!',
			cover: 'https://i.scdn.co/image/f57a69bfb8aef58b2b2cee85cb82eddab8daeca1',
			artists: [{ name: 'Ying Yang Twins' }],
		});
		// let [playlist, setPlaylist] = useState(props.playlist);
		let seasonInterval = Math.floor(props.playlist.length / 4);
		
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
	return (
		<div
			style={{
				// background: '#DCDFDE',
				height: '25vh',
				width: '90vw',
				margin: '10px',
				border: '2px solid black',
				position: 'fixed',
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
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginTop: '10px',
				}}>
				<button
					onClick={() => {
						setBackground('linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)');
						setSeason(props.playlist);
					}}>
					all
				</button>

				<button
					onClick={() => {
						setSeason(props.playlist.slice(0, seasonInterval));
						setBackground('linear-gradient(#FF5629, #FFFFFF)');
					}}>
					summer
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#FF9129 , #FFFFFF)');
						setSeason(
							props.playlist.slice(seasonInterval, seasonInterval * 2 + 1)
						);
					}}>
					spring
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#F2FD89, #FFFFFF)');

						setSeason(
							props.playlist.slice(seasonInterval * 2, seasonInterval * 3 + 1)
						);
					}}>
					fall
				</button>
				<button
					onClick={() => {
						setBackground('linear-gradient(#6CFFDB, #FFFFFF)');
						setSeason(props.playlist.slice(seasonInterval * 3));
					}}>
					winter
				</button>
			</div>
		</div>
	);
}

export default Player;