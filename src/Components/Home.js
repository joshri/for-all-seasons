import React, { useState, useEffect } from 'react';
import Playlist from './Playlist';
import Spinner from 'react-bootstrap/Spinner'

function Home(props) {
	let [ids, setIds] = useState([]);
	let [features, setFeatures] = useState([]);
	let [seasonSorted, setSeasonSorted] = useState([]);
	let [season, setSeason] = useState(props.playlist);
	let [background, setBackground] = useState(
		'linear-gradient(#FF5629, #FF9129, #F2FD89,#6CFFDB)'
	);

	//break down state for useEffect dependencies
	let access = props.access;
	let artist = props.artist;
	let tracks = { tracks: props.tracks, setTracks: props.setTracks };

	//get tracks
	useEffect(() => {
		//get 50 tracks from artist
		fetch(
			`https://api.spotify.com/v1/search?q=artist:${
				artist.name || 'Ying Yang Twins'
			}&type=track&limit=50`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access}`,
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				//popularity value sort
				let popSort = res.tracks.items.sort(function (a, b) {
					return b.popularity - a.popularity;
				});
				//search for remixes/duplicates
				let forTracks = [];
				let isDupe = false;

				for (let i = 0; i < popSort.length; i++) {
					isDupe = false;
					//left paren is indicator of a remixed version
					let popTest = popSort[i].name.split('(')[0];
					for (let j = 0; j < forTracks.length; j++) {
						let trackTest = forTracks[j].name.split('(')[0];
						if (popTest.includes(trackTest) || trackTest.includes(popTest)) {
							isDupe = true;
							break;
						}
					}
					if (isDupe === false) {
						//relevent values out of track object
						forTracks.push({
							name: popSort[i].name,
							cover: popSort[i].album.images[2],
							artists: popSort[i].artists,
							id: popSort[i].id,
							uri: popSort[i].uri,
						});
					}
				}
				//grab IDs for audio features search and set track objects in state
				let forIds = [];
				forTracks.forEach((track) => forIds.push(track.id));
				setIds(forIds);

				tracks.setTracks(forTracks);
			});
	}, [access, artist]);

	//once tracks are set, use ids to set audio features
	useEffect(() => {
		fetch(`https://api.spotify.com/v1/audio-features/?ids=${ids.join(',')}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				setFeatures(res['audio_features']);
			});
	}, [access, ids]);

	useEffect(() => {
		let seasonScore = [];

		if (features[0] != null) {
			for (let i = 0; i < features.length; i++) {
				//some songs might not have audio features
				if (
					!features[i].danceability ||
					!features[i].energy ||
					!features[i].valence
				) {
					seasonScore.push(-1);
					continue;
				}
				let score = 0;
				score =
					(features[i].danceability +
						features[i].energy +
						features[i].valence) /
					3;
				seasonScore.push((score.toFixed(3)) * 1000);
			}

			//add sort ranking to track objects
			let scoreIncrement = 0;
			if (tracks.tracks.length) {
				tracks.tracks.forEach((obj) => {
					obj.seasonScore = seasonScore[scoreIncrement];
					scoreIncrement++;
				});
				setSeasonSorted(
					props.tracks.sort(function (a, b) {
						return b.seasonScore - a.seasonScore;
					})
				);
			}
		}
	}, [features]);

	if (!seasonSorted.length) {
		return (
			<div style={{ background: '#EDAEFF', width: '100vw', height: '100vh' }}>
				<Spinner>Loading</Spinner>
				<p>Stuck? Your add blocker might be blocking the Spotify API!</p>
			</div>
		);
	} else {

		return (
			<div>
				<Playlist
					playlist={seasonSorted}
					access={props.access}
					playerId={props.playerId}
					userId={props.id}
					artist={artist}
				/>
			</div>
		);
		}
}

export default Home;
