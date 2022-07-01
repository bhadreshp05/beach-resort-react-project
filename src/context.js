import { createContext, useEffect, useReducer } from 'react';
import Client from './contentful';
const RoomContext = createContext();

const initialState = {
  rooms: [],
  sortedRooms: [],
  featuredRooms: [],
  loading: true,
  type: 'all',
  capacity: 1,
  price: 0,
  minPrice: 0,
  maxPrice: 0,
  minSize: 0,
  maxSize: 0,
  breakfast: false,
  pets: false,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'FETCH_ROOMS':
      return {
        ...state,
        rooms: payload.rooms,
        sortedRooms: payload.sortedRooms,
        featuredRooms: payload.featuredRooms,
        loading: payload.loading,
        price: payload.price,
        maxPrice: payload.maxPrice,
        maxSize: payload.maxSize,
      };
    case 'INPUT_CHANGE':
      return {
        ...state,
        [payload.name]: payload.value,
        sortedRooms: filterRooms({ ...state, [payload.name]: payload.value }),
      };
    default:
      return state;
  }
};

const getData = async () => {
  try {
    let response = await Client.getEntries({
      content_type: 'breachResortRoom',
      order: 'sys.createdAt',
    });

    let rooms = formatData(response.items);
    let featuredRooms = rooms.filter(room => room.featured === true);
    let maxPrice = Math.max(...rooms.map(room => room.price));
    let maxSize = Math.max(...rooms.map(room => room.size));

    return {
      rooms,
      featuredRooms,
      sortedRooms: rooms,
      loading: false,
      price: maxPrice,
      maxPrice,
      maxSize,
    };
  } catch (err) {
    console.log(err);
  }
};

const formatData = items => {
  let tempItems = items.map(item => {
    let id = item.sys.id;
    let images = item.fields.images.map(img => img.fields.file.url);
    return {
      ...item.fields,
      id,
      images,
    };
  });
  return tempItems;
};

const filterRooms = state => {
  let { rooms, type, capacity, price, minSize, maxSize, breakfast, pets } =
    state;

  // all the rooms
  let tempRooms = [...rooms];

  // transform value
  capacity = parseInt(capacity);
  price = parseInt(price);

  // filter by type
  if (type !== 'all') {
    tempRooms = tempRooms.filter(room => room.type === type);
  }

  // filter by capacity
  if (capacity !== 1) {
    tempRooms = tempRooms.filter(room => room.capacity >= capacity);
  }

  // filter by price
  tempRooms = tempRooms.filter(room => room.price <= price);

  // filter by size
  tempRooms = tempRooms.filter(
    room => room.size >= minSize && room.size <= maxSize
  );

  // filter by breakfast
  if (breakfast) {
    tempRooms = tempRooms.filter(room => room.breakfast === true);
  }

  // filter by pets
  if (pets) {
    tempRooms = tempRooms.filter(room => room.pets === true);
  }

  return tempRooms;
};

const RoomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData().then(res => {
      dispatch({ type: 'FETCH_ROOMS', payload: res });
    });
  }, []);

  const getRoom = slug => {
    let tempRooms = [...state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  const handleChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    dispatch({ type: 'INPUT_CHANGE', payload: { value, name } });
  };

  return (
    <RoomContext.Provider
      value={{
        ...state,
        getRoom: getRoom,
        handleChange: handleChange,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

const RoomConsumer = RoomContext.Consumer;

export { RoomProvider, RoomConsumer, RoomContext };
