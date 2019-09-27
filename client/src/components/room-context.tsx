import React from 'react';

const RoomContext = React.createContext({
  roomClient: {},
});

export default RoomContext;

export function withRoomContext(Component) {
  return (props) => (
    <RoomContext.Consumer>
      {(roomClient) => <Component {...props} roomClient={roomClient} />}
    </RoomContext.Consumer>
  );
}
