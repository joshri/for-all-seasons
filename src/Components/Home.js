import React, { useState, useEffect } from 'react';

import Playlist from './Playlist';
import Spinner from 'react-bootstrap/Spinner';

function Home(props) {
	//this component creates the sorted playlist from the artist name passed down through App + ArtistForm

	let [ids, setIds] = useState([]);
	let [features, setFeatures] = useState([]);
	let [seasonSorted, setSeasonSorted] = useState([]);

	//break down state for useEffect dependencies
	let access = props.access;
	let artist = props.artist;
	let tracks = { tracks: props.tracks, setTracks: props.setTracks };

	//TODO: change three useEffects into asynchronous functions?
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
					//separate title at left paren to test equality - we don't want to filter out songs with the same featured artist but different title, or songs with the same title and different features.
					let popTest = popSort[i].name.split('(')[0];
					for (let j = 0; j < forTracks.length; j++) {
						let trackTest = forTracks[j].name.split('(')[0];
						//test if title without features is the same
						if (popTest.includes(trackTest) || trackTest.includes(popTest)) {
							isDupe = true;
							break;
						}
					}
					//filters out artists with similar names that sneak onto the list
					if (popSort[i].artists[0].name !== artist.name) {
						isDupe = true;
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
		if (ids) {
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
		}
	}, [access, ids]);

	useEffect(() => {
		//once features are set, calculate season score and sort
		if (features[0] != null) {
			let seasonScore = [];
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
				seasonScore.push(score.toFixed(3) * 1000);
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
			<div className='loading'>
				<Spinner animation='border' role='status'/>
				<h4>Loading...</h4>
				<p>Stuck? Your add blocker might be blocking the Spotify API!</p>
			</div>
		);
	} else {
		return (
			<div>
				<Playlist
					access={props.access}
					currentlyPlaying={props.currentlyPlaying}
					setCurrentlyPlaying={props.setCurrentlyPlaying}
					playerId={props.playerId}
					playlist={seasonSorted}
					access={props.access}
					artist={artist}
					background={props.background}
					setBackground={props.setBackground}
				/>
			</div>
		);
	}
}

export default Home;
