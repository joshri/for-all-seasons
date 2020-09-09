import React, { useState, useEffect } from 'react';

//ying yang twins artist search request: 'https://api.spotify.com/v1/search?q=ying%20yang%20twins&type=artist'
// artist id: "44PA0rCQXikgOWbfY7Fq7m", from search: artists[0].images (array of three with heights 480, 200, 64), artists[0].name.

//ying yang twins track search request: 'https://api.spotify.com/v1/search?q=artist:ying%20yang%20twins&type=track&limit=50' (&offset=50) <- search is in res.tracks.next
//pretty accurate in terms of high to low popularity. tracks.items[index].id - could potentially offset to index 50 to get 100 results to max out audio features analysis.

//audio features by id: set a variable for each track's danceability, energy, and valence divided by three to weight equally (may change) (tempo? BPM apparently included in danceability). valence is literally about weighing happy vs sad sounding, so it might be interesting to increase weight of valence

function ArtistForm(props) {
	let formArtist = '';

	const loadArtist = (event) => {
        event.preventDefault();
        fetch(`https://api.spotify.com/v1/search?q=${formArtist}&type=artist`, {
        headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${props.access}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            props.setArtist(json.artists.items[0])
        })
        .catch(err => console.log(err))
        
    };

	return (
		<div>
			<form onSubmit={loadArtist}>
				<input type='text' placeholder='Ying Yang Twins' onChange={(event) => (formArtist = event.target.value)}/>
				<input type='submit' />
			</form>
		</div>
	);
}

export default ArtistForm;
