export const socketToUser = new Map<string, string>();
export const userToSockets = new Map<string, Set<string>>();
export const roomToSockets = new Map<string, Set<string>>();

export const addSocketForUser = (userId: string, socketId: string) => {
  socketToUser.set(socketId, userId);
  const set = userToSockets.get(userId) ?? new Set<string>();
  set.add(socketId);
  userToSockets.set(userId, set);
};

export const getSocketCountForUser = (userId: string) => {
  const s = userToSockets.get(userId);
  return s ? s.size : 0;
};

export const getUserSockets = (userId: string) => {
  return userToSockets.get(userId) ?? new Set<string>();
};

export function removeSocket(socketId: string) {
  const userId = socketToUser.get(socketId);
  if (!userId) return;
  socketToUser.delete(socketId);
  const s = userToSockets.get(userId);
  if (s) {
    s.delete(socketId);
    if (s.size === 0) userToSockets.delete(userId);
    else userToSockets.set(userId, s);
  }

  for (const [roomKey, sockets] of roomToSockets.entries()) {
    if (sockets.has(socketId)) {
      sockets.delete(socketId);
      if (sockets.size === 0) roomToSockets.delete(roomKey);
      else roomToSockets.set(roomKey, sockets);
    }
  }
}

export function addSocketToRoom(roomKey: string, socketId: string) {
  const set = roomToSockets.get(roomKey) ?? new Set<string>();
  set.add(socketId);
  roomToSockets.set(roomKey, set);
}

export function removeSocketFromRoom(roomKey: string, socketId: string) {
  const set = roomToSockets.get(roomKey);
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) roomToSockets.delete(roomKey);
  else roomToSockets.set(roomKey, set);
}

export function getSocketsInRoom(roomKey: string) {
  return roomToSockets.get(roomKey) ?? new Set<string>();
}
