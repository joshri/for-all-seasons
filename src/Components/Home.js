import React, { useState, useEffect } from 'react';



function Home(props) {
	const spotKey = process.env.SPOT_KEY;
	const spotId = process.env.SPOT_ID;
	const auth = btoa(`${spotId}:${spotKey}`);

	function play() {
		console.log(props.artist);
		console.log(props.access);
		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${props.access}`
			},
			body: JSON.stringify({"uris": [props.artist[0]]})
		})
		.catch(err => console.log(err))
	}

	useEffect(() => {
		//set playlists to ying yang
		fetch(
			'https://api.spotify.com/v1/search?q=artist:ying%20yang%20twins&type=track&limit=50',
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				let uris = [];
				uris = res.tracks.items.map((item) => item.uri);
				console.log(uris);
				props.setArtist(uris);
			});
		
	}, []);

	return (
		<div>
			<h1>howdy earth</h1>
			<button onClick={play}>play</button>
		</div>
	);
}

export default Home;
