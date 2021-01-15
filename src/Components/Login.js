import React from 'react';

function Login(props) {
	const backLink = 'http://localhost:8080/auth/spotify';

	return (
		<div className='animate'>
			<h1 className='title'>Ying Yang Twins</h1>

			<p className='animate-2'>for all seasons</p>
			{props.code ? (
				<p className='animate-3'>loading</p>
			) : (
				<div className='post-title'>
					<p className='animate-3'>Powered by Spotify</p>
					<p className='animate-3'>Premium and disabled add blocker required</p>
					<a className='animate-a' href={backLink}>
						login
					</a>
				</div>
			)}
		</div>
	);
}

export default Login;
