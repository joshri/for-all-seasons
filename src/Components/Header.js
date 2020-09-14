import React from 'react';


function Header(props) {
	return (
		<div
			style={{
				// position: 'fixed',
				height: '15vh',
				width: '100vw',
				marginBottom: '10px',
				backgroundColor: '#EDAEFF',
				display: 'flex',
				flexWrap: 'nowrap'
			}}>
			<h1
				style={{
					fontSize: '11vw',
					fontFamily: "'Sacramento', cursive",
					padding: '10px',
					margin: 0,
					
				}}>
				{props.artist.name || 'Ying Yang Twins'}{' '} 
				<span
					style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '18px', marginTop: 0, marginBottom: '10vh', display: 'inline-block' }}>
					{' '}
					- for all seasons
				</span>
			</h1>
		</div>
	);
}

export default Header;
