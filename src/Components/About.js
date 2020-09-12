import React, { useState } from 'react';

function About(props) {
	const handleClose = () => setShow(false);

	return (
		<>
			<button onClick={handleShow}>Launch demo modal</button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
				<Modal.Footer>
					<button onClick={handleClose}>Close</button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default About;
