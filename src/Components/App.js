import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './Home';
import Header from './Header';
import Login from './Login';
import ArtistForm from './ArtistForm';

import { ScriptCache } from './ScriptCache';

//handle login - get token - initialize player

function App() {
	let [playerId, setPlayerId] = useState('');
	let [access, setAccess] = useState('');
	let [ready, setReady] = useState(false)
	let [refresh, setRefresh] = useState('');
	let [id, setId] = useState('');
	let [artist, setArtist] = useState({name: 'Ying Yang Twins'});
	let [tracks, setTracks] = useState('');
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: "Naggin'",
		cover: "https://i.scdn.co/image/ab67616d000048511f52a7e9b573959c8e430974",
		artists: [{name: "Ying Yang Twins"}],
	});
  
	function spotifySDKCallback() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			if (access && !ready) {
				const token = access;
				const player = new window.Spotify.Player({
					name: 'For All Seasons',
					getOAuthToken: (cb) => {
						cb(token);
					},
					volume: 0.5,
				});
				// Error handling
				// player.addListener('initialization_error', ({ message }) => {
				// 	console.error(message);
				// });
				// player.addListener('authentication_error', ({ message }) => {
				// 	console.error(message);
				// });
				// player.addListener('account_error', ({ message }) => {
				// 	console.error(message);
				// });
				// player.addListener('playback_error', ({ message }) => {
				// 	console.error(message);
				// });

				// Playback status updates
				player.addListener('player_state_changed', (state) => {
					console.log(state);
					let track = state.track_window.current_track
					if (track.name === currentlyPlaying.name) {
						return console.log('avoided');
					} else {
						setCurrentlyPlaying({
							name: track.name,
							cover: track.album.images[1].url,
							artists: track.artists,
						});
					}

				});

				// Ready
				player.addListener('ready', ({ device_id }) => {
					setReady(true);
					setPlayerId(device_id);
					console.log('Ready with Device ID', device_id);
				});

				// // Not Ready
				// player.addListener('not_ready', ({ device_id }) => {
				// 	console.log('Device ID has gone offline', device_id);
				// });

				// Connect to the player!
				player.connect();
			}
		};
	}

	//allows loading of spotify player script tags into html - see below
	//https://github.com/nbarsova/spotify-react-demo/blob/master/src/ScriptCache.js
	new ScriptCache([
		{
			name: 'https://sdk.scdn.co/spotify-player.js',
			callback: spotifySDKCallback,
		},
	]);

	useEffect(() => {
		//grab access token and user id after login
		const queryString = require('query-string');
    	let parsed = queryString.parse(window.location.search);
		setAccess(parsed.accesstoken);
		setRefresh(parsed.refreshtoken);
    	setId(parsed.id);
	}, []);

	//if there is no access token render login
	if (!access) {
		return <Login />;
	} else {
		return (
			<div
				style={{
					opacity: 0,
					animation: 'fadeIn 1.5s ease-in forwards',
					backgroundColor: '#EDAEFF',
				}}>
				<Header artist={artist} access={access} setArtist={setArtist} />
				<ArtistForm access={access} setArtist={setArtist} />
				<Home
					currentlyPlaying={currentlyPlaying}
					setCurrentlyPlaying={setCurrentlyPlaying}
					playerId={playerId}
					setArtist={setArtist}
					artist={artist}
					setTracks={setTracks}
					tracks={tracks}
					access={access}
					id={id}
				/>
			</div>
		);
	}
}

export default App;