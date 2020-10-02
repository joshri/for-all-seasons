import React from 'react';
import Modal from 'react-bootstrap/Modal'

function About(props) {
	
	return (
		<Modal
            scrollable={true}
			show={props.show}
			onHide={props.handleClose}
            dialogClassName={'modal'}>
			<Modal.Header closeButton >
				<Modal.Title>WHAT AM I LOOKING AT?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Thanks for asking. <br></br>
				<br></br>This is, of course, Ying Yang Twins for all seasons -
				delivering four seasonal playlists from your favorite artist's top 50
				songs sorted by the Spotify API (using the audio features endpoint and
				its values of danceability, energy, and valence). <br></br>
				<br></br>That number next to the song is the Season Score(tm obviously).
				A score close to 1000 indicates a Summer with the heat of ten thousand
				raging suns, while a score closer to 0 would indicate a winter so cold
				that you wouldn't be able to even hear the song, because your body would
				be frozen solid.<br></br>
				<br></br>Use the player at the top to change the song, or buttons below to change the season. If you click on save playlist to Spotify it'll actually do it so be careful! Created using React,
				a little React Bootstrap, Node, Express, and a lot of love by Joshua
				Israel. Code available at{' '}
				<a
					style={{ textDecoration: 'underline' }}
					href='https://github.com/joshri/for-all-season'>
					github.com/joshri/for-all-seasons
				</a>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={props.handleClose}>Close</button>
			</Modal.Footer>
		</Modal>
	);
}

export default About;
