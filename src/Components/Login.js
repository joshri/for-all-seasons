import React from 'react';

function Login(props) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				animation: 'fadeIn 1.5s ease-in forwards',
				backgroundColor: '#EDAEFF',
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
			<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
				<h3
					style={{
						opacity: 0,
						marginTop: '10vh',
						fontSize: '14px',
						animation: 'fadeIn 1.5s 3s ease-in forwards',
					}}>
					Powered by Spotify
				</h3>
				<p
					style={{
						animation: 'fadeIn 1.5s 3s ease-in forwards',
						opacity: 0,
						fontSize: '14px',
						width: '100vw',
						textAlign: 'center',
					}}>
					Premium and disabled add blocker required
				</p>
				<a
					href='https://seasons-backend.herokuapp.com/auth/spotify'
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
		</div>
	);
}

export default Login;
