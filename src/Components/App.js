import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './Home';
import Header from './Header';
import Login from './Login';
import ArtistForm from './ArtistForm';
import Playlist from './Playlist';
import Player from './Player';
import { ScriptCache } from './ScriptCache';

//handle login - get token - initialize player

function App() {
	let [playerId, setPlayerId] = useState('');
	let [access, setAccess] = useState('');
	let [refresh, setRefresh] = useState('');
	let [id, setId] = useState('');
	let [artist, setArtist] = useState('');

	//ying yang image defaults: artist.images
	// 0: {height: 480, url: "https://i.scdn.co/image/8a522c7faa13cf4321ca6bea075fd97f75f40cfe", width: 480}
	//1: {height: 200, url: "https://i.scdn.co/image/b434cb66ee3b358bd1707bce3e7371f158184f8c", width: 200}
	//2: {height: 64, url: "https://i.scdn.co/image/f57a69bfb8aef58b2b2cee85cb82eddab8daeca1", width: 64}

	//ying yang id default: artist.id = 44PA0rCQXikgOWbfY7Fq7m
	let [tracks, setTracks] = useState('');
	let [season, setSeason] = useState('neutral');

	function spotifySDKCallback() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			if (access) {
				const token = access;
				const player = new window.Spotify.Player({
					name: 'For All Seasons',
					getOAuthToken: (cb) => {
						cb(token);
					},
				});
				// Error handling
				player.addListener('initialization_error', ({ message }) => {
					console.error(message);
				});
				player.addListener('authentication_error', ({ message }) => {
					console.error(message);
				});
				player.addListener('account_error', ({ message }) => {
					console.error(message);
				});
				player.addListener('playback_error', ({ message }) => {
					console.error(message);
				});

				// Playback status updates
				player.addListener('player_state_changed', (state) => {
					console.log(state);
				});

				// Ready
				player.addListener('ready', ({ device_id }) => {
					setPlayerId(device_id);
					console.log('Ready with Device ID', device_id);
				});

				// Not Ready
				player.addListener('not_ready', ({ device_id }) => {
					console.log('Device ID has gone offline', device_id);
				});

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
  
  //play funtion for links and player
	function play(uri) {
		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playerId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`,
			},
			body: JSON.stringify({ "uris": [uri] }),
		}).catch((err) => console.log(err));
	}

	//if there is no access token render login
	if (!access) {
		return <Login />;
	} else {
		return (
			<div>
				<Header artist={artist} />
				<ArtistForm access={access} setArtist={setArtist} />
        <Player playerId={playerId} play={play} access={access}/>
				<Home
					playerId={playerId}
					setArtist={setArtist}
					artist={artist}
					setTracks={setTracks}
					tracks={tracks}
					access={access}
          id={id}
          play={play}
				/>
			</div>
		);
	}
}

export default App;
