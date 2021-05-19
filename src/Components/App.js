import React, { useState, useEffect } from 'react';
import './App.scss';
import Home from './Home';
import Header from './Header';
import Login from './Login';
import Backgrounds from './Backgrounds';
import { ScriptCache } from './ScriptCache';

function App() {
	//pull tokens
	const queryString = require('query-string');
	let parsed = queryString.parse(window.location.search);
	//tokens
	let [access, setAccess] = useState('');
	let [refresh, setRefresh] = useState('');
	//web player sdk
	let [playerId, setPlayerId] = useState('');
	let [ready, setReady] = useState(false);
	//spotify api data
	let [artist, setArtist] = useState({ name: 'Ying Yang Twins' });
	let [tracks, setTracks] = useState('');
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: 'Select a Track!',
		cover: 'https://i.scdn.co/image/ab67616d000048511f52a7e9b573959c8e430974',
		artists: [{ name: '' }],
	});
	//ambitious background
	let [background, setBackground] = useState({
		0: '#EDAEFF',
		1: 'All Seasons',
	});

	//web player set up - see script cache class below
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

				// Playback status updates
				player.addListener('player_state_changed', (state) => {
					let track = state.track_window.current_track;
					if (track.name === currentlyPlaying.name) {
						return;
					} else {
						setCurrentlyPlaying({
							name: track.name,
							cover: track.album.images[1].url,
							artists: track.artists,
							uri: track.uri,
						});
					}
				});

				// Ready
				player.addListener('ready', ({ device_id }) => {
					setReady(true);
					setPlayerId(device_id);
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
		//grab tokens and user id from url using query string module after login
		setAccess(parsed.access_token);
		setRefresh(parsed.refresh_token);
	}, [parsed]);

	//if there is no access token render login
	if (!access) {
		return <Login/>;
	} else {
		return (
			<main style={{ background: background[0] }}>
				<Backgrounds background={background} />
				<Header artist={artist} access={access} setArtist={setArtist} />
				<Home
					currentlyPlaying={currentlyPlaying}
					setCurrentlyPlaying={setCurrentlyPlaying}
					playerId={playerId}
					setArtist={setArtist}
					artist={artist}
					setTracks={setTracks}
					tracks={tracks}
					access={access}
					background={background}
					setBackground={setBackground}
				/>
			</main>
		);
	}
}

export default App;
