import React, {useState} from 'react';

function Player(props) {
    let [currentlyPlaying, setCurrentlyPlaying] = useState('click on a song to play!')
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
            <main>{currentlyPlaying}</main>
			<button onClick={pause}>pause</button>
		</div>
	);
}

export default Player;
