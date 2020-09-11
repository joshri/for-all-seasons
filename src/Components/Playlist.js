import React from 'react';

function Playlist(props) {
	return (
		<main>
			{props.playlist.map((track) => {
				return (
					<div>
						<h5>{track.name}</h5> <button onClick={() => {props.play(track)}}>Play</button>
					</div>
				);
			})}
		</main>
	);
}

export default Playlist;
