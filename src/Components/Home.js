import React, { useState, useEffect } from 'react';
import Playlist from './Playlist';
import Player from './Player';

function Home(props) {
	let [ids, setIds] = useState([]);
	let [features, setFeatures] = useState([]);
	let [currentlyPlaying, setCurrentlyPlaying] = useState({
		name: 'Click Play on a Song!!',
		cover: 'https://i.scdn.co/image/b434cb66ee3b358bd1707bce3e7371f158184f8c',
		artists: ['Ying Yang Twins'],
	});
	let [seasonSorted, setSeasonSorted] = useState([])

	//play function for links and player
	function play(track) {
		setCurrentlyPlaying({
			name: track.name,
			cover: track.cover,
			artists: track.artists,
		});
		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${props.access}`,
			},
			body: JSON.stringify({ uris: [track.uri] }),
		}).catch((err) => console.log(err));
	}

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
				//search for remixes/duplicates
				let forTracks = [];
				let isDupe = false;
				console.log(popSort);

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
				console.log(forTracks);
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

	async function sortResult() {
		await useEffect;
	
		let seasonScore = [];
		console.log(features);
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
				(features[i].danceability + features[i].energy + features[i].valence) /
				3;
			seasonScore.push(score.toFixed(3));
		}

		console.log(seasonScore);
		//add sort ranking to track objects
		let scoreIncrement = 0;
		props.tracks.forEach((obj) => {
			obj.seasonScore = seasonScore[scoreIncrement];
			scoreIncrement++;
		});
		let seasonSorted2 = props.tracks.sort(function (a, b) {
			return b.seasonScore - a.seasonScore;
		});
		setSeasonSorted(seasonSorted2);
}

sortResult()
	
		return (
			<div>
				<Player
					playlist={seasonSorted}
					playerId={props.playerId}
					play={play}
					access={props.access}
					currentlyPlaying={currentlyPlaying}
				/>
				<Playlist play={play} playlist={seasonSorted} />
			</div>
		);
	
}

export default Home;
