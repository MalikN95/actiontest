export enum ChatEvents {
  CREATE_BUSINESS_CHAT = 'createBusinessChat',
  CREATE_CHAT = 'createChat',
  RECEIVE_CHAT = 'receiveChat',
  SEND_MESSAGE = 'sendMessage',
  RECEIVE_MESSAGE = 'receiveMessage',
  JOIN_ROOMS_AS_GUEST = 'joinGuestRooms',
  JOIN_ALL_ROOMS = 'joinAllRooms',
  SEND_ALL_CHATS = 'sendAllChats',
  LEAVE_ROOM = 'leaveRoom',
  ERROR = 'error',
  ERROR_UNAUTHORIZED = 'errorUnauthorized',
  ERROR_ON_CONNECTION = 'errorOnConnection',
}
