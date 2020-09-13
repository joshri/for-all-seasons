import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
function Login(props) {
	return (
		<div
			style={{
				top: 0,
				left: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				animation: 'fadeIn 1.5s ease-in forwards',
				backgroundColor: '#CEB0D6',
				backgroundSize: 'cover',
				minHeight: '100vh',
				minWidth: '100vw',
			}}>
			<h1 className='title'>Ying Yang Twins</h1>
			<p
				style={{
					fontSize: '5vw',
					marginTop: 0,
					marginLeft: '50vw',
					opacity: 0,
					animation: 'fadeIn 1.5s 1.5s ease-in forwards',
				}}>
				for all seasons
			</p>

			<h3
				style={{
					opacity: 0,
					marginTop: '10vh',
					fontSize: '14px',
					animation: 'fadeIn 1.5s 3s ease-in forwards',
				}}>
				Powered by Spotify
			</h3>
			<a
				href='http://localhost:8080/auth/spotify'
				style={{
					animation: 'fadeIn 1.5s 3s ease-in forwards',
					border: '1px solid black',
					opacity: 0,
					borderRadius: '5px',
					padding: '5px',
				}}>
				login
			</a>
		</div>
	);
}

export default Login;
