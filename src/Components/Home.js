import React, { useState, useEffect} from 'react';




function Home () {
    const spotKey = process.env.SPOT_KEY;
    const spotId = process.env.SPOT_ID;
    const auth = btoa(`${spotId}:${spotKey}`)
	let [artist, setArtist] = useState('');
	let [season, setSeason] = useState('neutral');

	useEffect(() => {
	      fetch({
        url:'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {Authorization: `Basic ${auth}`},
        body: {"grant_type": "client_credentials"},
        json: true
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
})

	return (
		<div>
			<h1>howdy earth</h1>
		</div>
	);
}


export default Home;