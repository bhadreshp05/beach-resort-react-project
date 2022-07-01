import { useContext } from 'react';
import { RoomContext } from '../context';
import Loading from './Loading';
import Room from './Room';
import Title from './Title';

const FeaturedRooms = () => {
  const { loading, rooms } = useContext(RoomContext);

  const displayRooms = rooms
    .filter(room => room.featured === true)
    .map(room => <Room key={room.id} room={room} />);

  return (
    <div className='featured-rooms'>
      <Title title='featured rooms' />
      <div className='featured-rooms-center'>
        {displayRooms.length === 0 && (
          <div className='empty-search'>
            <h3>unfortunately no featured rooms available</h3>
          </div>
        )}
        {loading ? <Loading /> : displayRooms}
      </div>
    </div>
  );
};

export default FeaturedRooms;
