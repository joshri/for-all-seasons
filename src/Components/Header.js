import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
    render() {
        return (
					<div>
						<Link className='header' to='./'>
							<h1>Ying Yang Twins: For All Seasons</h1>
						</Link>
					</div>
				);
    }
}

export default Header;