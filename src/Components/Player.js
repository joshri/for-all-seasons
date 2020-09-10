import React from 'react';

function Player(props) {
	function pause() {
		fetch(
			`https://api.spotify.com/v1/me/player/pause?device_id=${props.playerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.access}`,
				},
			}
		);
	}
	//title //artist //album art //timestamps //play, pause, back, next
	return (
		<div>
			<button onClick={pause}>pause</button>
		</div>
	);
}

export default Player;
