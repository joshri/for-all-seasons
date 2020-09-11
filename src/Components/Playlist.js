import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

// function Playlist(props) {
//     let display = [];

//     if (props.playlist) {
//     display = props.playlist.map(song => {

//     return <li onClick={() => props.play(song.uri)}>{song.name}</li>
// })
//     }

const Container = styled.main``;
const Track = styled.div``;

class Playlist extends React.Component {
	constructor(props) {
		super(props);

		

		this.onDragEnd = (result) => {
			const { destination, source, draggableId } = result;
			if (!destination) {
				return;
			}
			if (
				destination.droppableId === source.droppableId &&
				destination.index === source.index
			) {
				return;
			}
			console.log(draggableId);
			console.log(destination);
			const playlist = Array.from(this.state.tracks);
			playlist.splice(source.index, 1);
			playlist.splice(destination.index, 0, this.state.tracks[source.index]);

			this.setState({ tracks: playlist });
			console.log(this.state.tracks);
		};
		this.state = {
			tracks: this.props.playlist,
		};
	}

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId={'playlistContainer'}>
					{(provided) => (
						<Container {...provided.droppableProps} ref={provided.innerRef}>
							{this.state.tracks.map((track, index = -1) => {
								index++;
								return (
									<Draggable
										draggableId={`${track.uri}`}
										index={index}
										key={track.uri}>
										{(provided) => (
											<Track
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												ref={provided.innerRef}>
												<p>{track.name}</p>
											</Track>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

export default Playlist;
