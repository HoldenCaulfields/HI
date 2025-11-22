import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import { generateUniverseData } from "../utils/generator.js";
import Universe from '../models/Universe.js';

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

        socket.on('join_universe', async (query) => {
            if (!query) return;
            const room = query.toLowerCase().trim();
            socket.join(room);

            try {
                // Find existing universe or create new one
                let universe = await Universe.findOne({ query: room });

                if (!universe) {
                    console.log(`Creating new universe for: ${room}`);
                    const generated = generateUniverseData(room);
                    universe = new Universe({
                        query: room,
                        ...generated
                    });
                    await universe.save();
                }

                // Send initial data to client
                socket.emit('init_data', {
                    nodes: universe.nodes,
                    links: universe.links,
                    theme: universe.theme
                });

            } catch (err) {
                console.error("Error fetching universe:", err);
            }
        });

        // Handle Real-time Node Movement
        socket.on('move_node', ({ query, nodeId, x, y }) => {
            const room = query.toLowerCase().trim();
            // Broadcast to everyone else in the room
            socket.to(room).emit('node_moved', { nodeId, x, y });
        });

        socket.on('disconnect', () => {
            console.log('socket disconnect', socket.id);
        });
    });

    return io;
}

export default initSockets;