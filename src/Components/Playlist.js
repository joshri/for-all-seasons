import React, { useState, useEffect } from 'react';
import Player from './Player';
import ListGroup from 'react-bootstrap/ListGroup';
import SortAndSave from './SortAndSave';

function Playlist(props) {
	let [season, setSeason] = useState(props.playlist);
	let effectChange = props.playlist;

	function play(track) {
		let newUris = [];
		for (let i = season.indexOf(track); i < season.length; i++) {
			newUris.push(season[i].uri);
		}

		fetch(
			`https://api.spotify.com/v1/me/player/play?device_id=${props.playerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
				body: JSON.stringify({ uris: newUris }),
			}
		);
	}

	useEffect(() => {
		setSeason(effectChange);
	}, [effectChange]);

	return (
		<div>
			<Player
				season={season}
				access={props.access}
				currentlyPlaying={props.currentlyPlaying}
				setCurrentlyPlaying={props.setCurrentlyPlaying}
				playerId={props.playerId}
				play={play}
			/>
			<SortAndSave
				access={props.access}
				original={props.playlist}
				season={season}
				setSeason={setSeason}
				userId={props.userId}
				background={props.background}
				setBackground={props.setBackground}
				artist={props.artist}
			/>
			<div>
				<ListGroup>
					{season.map((track) => {
						return (
							<ListGroup.Item
							key={track.uri}
								onClick={() => {
									play(track);
								}}
								variant='flush'>
								<h5>
									{track.seasonScore} - {track.name}
								</h5>
								<button
									onClick={() => {
										play(track);
									}}>
									<svg
										width='1.5em'
										height='1.5em'
										viewBox='0 0 16 16'
										class='bi bi-play'
										fill='currentColor'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											fill-rule='evenodd'
											d='M10.804 8L5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z'
										/>
									</svg>
								</button>
							</ListGroup.Item>
						);
					})}
				</ListGroup>
			</div>
		</div>
	);
}

export default Playlist;
