import React, { Component } from 'react';
import { RoomContext } from '../context';
import Loading from './Loading';
import Title from './Title';
import Room from './Room';

class FeaturedRooms extends Component {
	static contextType = RoomContext;
	render() {
		let { loading, featuredRooms: rooms } = this.context;

		rooms = rooms.map(room => {
			return <Room key={room.id} room={room} />;
		});

		return (
			<div className="featured-rooms">
				<Title title="featured rooms" />
				<div className="featured-rooms-center">
					{rooms.length === 0 && (
						<div className="empty-search">
							<h3>unfortunately no featured rooms available</h3>
						</div>
					)}
					{loading ? <Loading /> : rooms}
				</div>
			</div>
		);
	}
}

export default FeaturedRooms;
