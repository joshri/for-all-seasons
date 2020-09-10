import React from 'react';

function Playlist(props) {
    let display = [];

    if (props.playlist) {
    display = props.playlist.map(song => {
        
    return <li onClick={() => props.play(song.uri)}>{song.name}</li>
})
    }
    return (
			<div>
                <ul>{display || 'LOADING'}</ul>
			</div>
		);
}

export default Playlist;