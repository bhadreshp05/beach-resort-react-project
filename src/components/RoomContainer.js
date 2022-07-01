import Loading from '../components/Loading';
import { RoomConsumer } from '../context';
import RoomFilter from './RoomFilter';
import RoomList from './RoomList';

const RoomContainer = () => {
  return (
    <RoomConsumer>
      {value => {
        const { loading, sortedRooms, rooms } = value;
        if (loading) {
          return <Loading />;
        }
        return (
          <div>
            <RoomFilter rooms={rooms} />
            <RoomList rooms={sortedRooms} />
          </div>
        );
      }}
    </RoomConsumer>
  );
};

export default RoomContainer;
