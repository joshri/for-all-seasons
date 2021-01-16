import React from 'react';

function Backgrounds(props) {
	return (
		<section>
			{props.background[1] === 'Fall' ? (
				<div className='fall'>
					<div>
						<i style={{ animationDelay: '7s' }}></i>
						<i style={{ animationDelay: '4s' }}></i>
						<i></i>
					</div>
					<div>
						<i style={{ animationDelay: '8s' }}></i>
						<i style={{ animationDelay: '6s' }}></i>
						<i style={{ animationDelay: '2s' }}></i>
					</div>
					<div>
						<i style={{ animationDelay: '5s' }}></i>
						<i style={{ animationDelay: '3s' }}></i>
						<i style={{ animationDelay: '1s' }}></i>
					</div>
				</div>
			) : (
				<div></div>
			)}
			{props.background[1] === 'Spring' ? (
				<div style={{ opacity: 1 }}>
					<div className='flower'>
						<div className='flower petal'></div>
						<div
							style={{ transform: 'rotate(45deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(90deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(135deg)' }}
							className='flower petal'></div>
					</div>
					<div className='flower flower-right'>
						<div className='flower petal'></div>
						<div
							style={{ transform: 'rotate(45deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(90deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(135deg)' }}
							className='flower petal'></div>
					</div>
					<div style={{ top: '25vh' }} className='flower'>
						<div className='flower petal'></div>
						<div
							style={{ transform: 'rotate(45deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(90deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(135deg)' }}
							className='flower petal'></div>
					</div>
					<div style={{ top: '25vh' }} className='flower flower-right'>
						<div className='flower petal'></div>
						<div
							style={{ transform: 'rotate(45deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(90deg)' }}
							className='flower petal'></div>
						<div
							style={{ transform: 'rotate(135deg)' }}
							className='flower petal'></div>
					</div>
				</div>
			) : (
				<div></div>
			)}
			{props.background[1] === 'Winter' ? (
				<div style={{ opacity: 1 }}>
					<div className={`bg-div ${props.background[1]}`}></div>
					<div className={`bg-div ${props.background[1]} two`}></div>
				</div>
			) : (
				<div></div>
			)}
			{props.background[1] === 'Summer' ? (
				<div style={{ opacity: 1 }}>
					<div className='ray'></div>
					<div style={{ animationDelay: '1s' }} className='ray'></div>
					<div style={{ animationDelay: '2s' }} className='ray'></div>
					<div style={{ animationDelay: '3s' }} className='ray'></div>
					<div style={{ animationDelay: '4s' }} className='ray'></div>
					<div style={{ animationDelay: '5s' }} className='ray'></div>
				</div>
			) : (
				<div></div>
			)}
		</section>
	);
}

export default Backgrounds;
