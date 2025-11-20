import { Server } from "socket.io";
import jwt from 'jsonwebtoken';

function initSockets(server) {
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', socket => {
        console.log('socket connected', socket.id);

        socket.on('join_group', ({ groupId, token }) => {
            socket.join(groupId);
            socket.data.groupId = groupId;
            // optional: verify token to attach userId
            try {
                if (token) {
                    const payload = jwt.verify(token, config.jwtSecret);
                    socket.data.userId = payload.id;
                }
            } catch (e) { }
            io.to(groupId).emit('user_joined', { socketId: socket.id, groupId });
        });

        socket.on('leave_group', ({ groupId }) => {
            socket.leave(groupId);
            io.to(groupId).emit('user_left', { socketId: socket.id, groupId });
        });

        socket.on('send_message', (msg) => {
            // msg should include: groupId, senderId, content, type
            if (msg && msg.groupId) {
                io.to(msg.groupId).emit('receive_message', msg);
            }
        });

        socket.on('disconnect', () => {
            console.log('socket disconnect', socket.id);
        });
    });


    return io;
}

export default initSockets;