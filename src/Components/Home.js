import React, { useState, useEffect } from 'react';
import Playlist from './Playlist';

function Home(props) {
	let [ids, setIds] = useState([]);
	let [features, setFeatures] = useState([]);
	let seasonSorted = [];
	let summer = [];
	let spring = [];
	let fall = [];
	let winter = [];

	//get tracks
	useEffect(() => {
		//get 50 tracks from artist
		fetch(
			`https://api.spotify.com/v1/search?q=artist:${
				props.artist.name || 'Ying Yang Twins'
			}&type=track&limit=50`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				//popularity value sort
				let popSort = res.tracks.items.sort(function (a, b) {
					return b.popularity - a.popularity;
				});
				//grab relevant values out of track object
				let forTracks = popSort.map((track) => {
					return {
						name: track.name,
						cover: track.album.images[2],
						artists: track.artists,
						id: track.id,
						uri: track.uri,
					};
				});
				//grab IDs for audio features search and set track objects in state
				let forIds = [];
				forTracks.forEach((track) => forIds.push(track.id));
				setIds(forIds);
				props.setTracks(forTracks);
			});
	}, [props.artist]);
	//once tracks are set, use ids to set audio features
	useEffect(() => {
		fetch(`https://api.spotify.com/v1/audio-features/?ids=${ids.join(',')}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				setFeatures(res['audio_features']);
			});
	}, [props.tracks]);

	//if features are set, sort by feature values
	if (features.length > 10) {
		let seasonScore = [];
		console.log(features);
		for (let i = 0; i < 48; i++) {
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
				(features[i].danceability + features[i].energy + features[i].valence) /
				3;
			seasonScore.push(score.toFixed(3));
		}

		console.log(seasonScore);
		let scoreIncrement = 0;
		props.tracks.forEach((obj) => {
			obj.seasonScore = seasonScore[scoreIncrement];
			scoreIncrement++;
		});
		console.log(props.tracks);
		seasonSorted = props.tracks.sort(function (a, b) {
			return b.seasonScore - a.seasonScore;
		});
		console.log(seasonSorted);
		let i = 0;
		while (i < 13) {
			summer.push(seasonSorted[i]);
			i++
		}
		while (i < 25) {
			spring.push(seasonSorted[i]);
			i++
		}
		while (i < 37) {
			fall.push(seasonSorted[i]);
			i++
		}
		while (i < 49) {
			winter.push(seasonSorted[i]);
			i++
		}
		winter.reverse();
		fall.reverse();
	}

		return (
			<div>
				<Playlist play={props.play} playlist={winter} />
				<Playlist play={props.play} playlist={fall} />
				<Playlist play={props.play} playlist={spring} />
				<Playlist play={props.play} playlist={summer} />
			</div>
		);
	}


export default Home;
