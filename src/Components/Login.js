import React from 'react';

function Login(props) {
	return (
		<div className='animate'>
			<h1 className='title'>Ying Yang Twins</h1>

			<p className='animate-2'>for all seasons</p>
			<div className='post-title'>
				<p className='animate-3'>Powered by Spotify</p>
				<p className='animate-3'>Premium and disabled add blocker required</p>
				<a
					className='animate-a'
					href='https://seasons-backend.herokuapp.com/auth/spotify'>
					login
				</a>
			</div>
		</div>
	);
}

export default Login;
