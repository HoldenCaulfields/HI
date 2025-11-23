import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import { generateUniverseData } from "../utils/generator.js";
import Universe from '../models/Universe.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import PrivateMessage from '../models/PrivateMessage.js';
import Answer from '../models/Answer.js';
import Notification from '../models/Notification.js';

function initSockets(server) {
    const io = new Server(server, { 
        cors: { 
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true 
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    // Online users tracking
    const onlineUsers = new Map(); // userId -> socketId
    const socketToUser = new Map(); // socketId -> userId

    // ============ MIDDLEWARE: JWT Authentication ============
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.data.userId = decoded.id;
                socket.data.username = decoded.username;
                
                // Update user's lastSeen
                await User.findByIdAndUpdate(decoded.id, { lastSeen: new Date() });
                
                // Track online status
                onlineUsers.set(decoded.id, socket.id);
                socketToUser.set(socket.id, decoded.id);
                
            } catch (e) {
                console.log('❌ Invalid token:', e.message);
            }
        }
        
        next();
    });

    io.on('connection', async (socket) => {
        const userId = socket.data.userId;
        const username = socket.data.username || 'Guest';
        
        console.log(`✅ ${username} connected (${socket.id})`);

        // Broadcast online status
        if (userId) {
            io.emit('user_online', { userId, username });
        }

        // ============ UNIVERSE (Graph Exploration) ============
        socket.on('join_universe', async (query) => {
            if (!query) return;
            const room = query.toLowerCase().trim();
            socket.join(room);
            
            try {
                let universe = await Universe.findOne({ query: room });

                if (!universe) {
                    console.log(`🌌 Creating universe: "${room}"`);
                    
                    // Find real users who searched this
                    const users = await User.find({
                        $or: [
                            { 'searchHistory.query': { $regex: room, $options: 'i' } },
                            { interests: { $in: [room] } }
                        ]
                    }).limit(15).lean();

                    // Find groups
                    const groups = await Group.find({
                        $or: [
                            { query: { $regex: room, $options: 'i' } },
                            { tags: { $in: [room] } }
                        ]
                    }).limit(8).lean();

                    // Find top answers
                    const answers = await Answer.find({
                        query: { $regex: room, $options: 'i' }
                    }).sort({ likesCount: -1 }).limit(5).populate('author', 'username').lean();

                    // Generate base theme and keywords
                    const generated = generateUniverseData(room);

                    // Build nodes
                    const centerX = 960; // assuming 1920px width
                    const centerY = 540; // assuming 1080px height
                    
                    // Create related keyword nodes
                    const relatedKeywords = ['explore', 'discover', 'connect', 'learn', 'share'];
                    const keywordNodes = relatedKeywords.map((kw, i) => {
                        const angle = (i / relatedKeywords.length) * Math.PI * 2;
                        const distance = 120;
                        return {
                            id: `keyword-${i}`,
                            label: kw,
                            type: 'KEYWORD',
                            x: centerX + Math.cos(angle) * distance,
                            y: centerY + Math.sin(angle) * distance,
                            vx: (Math.random() - 0.5),
                            vy: (Math.random() - 0.5),
                            radius: 12,
                            color: generated.theme.nodeColors.KEYWORD,
                            details: `Related: ${kw}`
                        };
                    });
                    
                    const nodes = [
                        {
                            id: 'root',
                            label: room.toUpperCase(),
                            type: 'ROOT',
                            x: centerX,
                            y: centerY,
                            vx: 0, vy: 0,
                            radius: 40,
                            color: generated.theme.nodeColors.ROOT,
                            details: `Central hub for "${room}"`
                        },
                        ...keywordNodes,
                        ...users.map((u, i) => {
                            const angle = (i / users.length) * Math.PI * 2;
                            const distance = 200 + Math.random() * 100;
                            return {
                                id: `user-${u._id}`,
                                label: u.username,
                                type: 'USER',
                                x: centerX + Math.cos(angle) * distance,
                                y: centerY + Math.sin(angle) * distance,
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                radius: 22,
                                color: generated.theme.nodeColors.USER,
                                details: u.bio || 'User interested in this topic',
                                refId: u._id
                            };
                        }),
                        ...groups.map((g, i) => {
                            const angle = ((i + users.length) / (users.length + groups.length)) * Math.PI * 2;
                            const distance = 250 + Math.random() * 100;
                            return {
                                id: `group-${g._id}`,
                                label: g.name,
                                type: 'GROUP',
                                x: centerX + Math.cos(angle) * distance,
                                y: centerY + Math.sin(angle) * distance,
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                radius: 28,
                                color: generated.theme.nodeColors.GROUP,
                                details: `${g.membersCount} members · ${g.tags?.join(', ')}`,
                                refId: g._id
                            };
                        }),
                        ...answers.map((a, i) => {
                            const angle = ((i + users.length + groups.length) / (users.length + groups.length + answers.length)) * Math.PI * 2;
                            const distance = 300 + Math.random() * 100;
                            return {
                                id: `answer-${a._id}`,
                                label: a.question.substring(0, 30) + '...',
                                type: 'ANSWER',
                                x: centerX + Math.cos(angle) * distance,
                                y: centerY + Math.sin(angle) * distance,
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                radius: 20,
                                color: generated.theme.nodeColors.ANSWER,
                                details: `By ${a.author?.username} · ${a.likesCount} likes`,
                                refId: a._id
                            };
                        })
                    ];

                    // Build links (connect keywords to root, others to keywords/root)
                    const links = [
                        ...keywordNodes.map(kn => ({
                            source: 'root',
                            target: kn.id
                        })),
                        ...nodes.slice(1 + keywordNodes.length).map((n, idx) => {
                            // Distribute connections between root and keywords
                            const targetId = idx % 3 === 0 ? 'root' : keywordNodes[idx % keywordNodes.length]?.id || 'root';
                            return {
                                source: targetId,
                                target: n.id
                            };
                        })
                    ];

                    universe = new Universe({
                        query: room,
                        nodes,
                        links,
                        theme: generated.theme,
                        activeUsers: userId ? [userId] : [],
                        visitCount: 1,
                        lastActivity: new Date()
                    });
                    await universe.save();
                } else {
                    // Update existing universe
                    universe.visitCount += 1;
                    universe.lastActivity = new Date();
                    if (userId && !universe.activeUsers.includes(userId)) {
                        universe.activeUsers.push(userId);
                    }
                    await universe.save();
                }

                socket.emit('init_data', {
                    nodes: universe.nodes,
                    links: universe.links,
                    theme: universe.theme
                });

                // Notify others
                socket.to(room).emit('user_joined_universe', {
                    username,
                    userId
                });

            } catch (err) {
                console.error("❌ Universe error:", err);
                socket.emit('error', { message: 'Failed to load universe' });
            }
        });

        socket.on('move_node', ({ query, nodeId, x, y }) => {
            const room = query.toLowerCase().trim();
            socket.to(room).emit('node_moved', { nodeId, x, y });
        });

        socket.on('leave_universe', (query) => {
            socket.leave(query.toLowerCase().trim());
        });

        // ============ GROUP CHAT ============
        socket.on('join_group', async ({ groupId }) => {
            socket.join(`group-${groupId}`);
            
            try {
                const group = await Group.findById(groupId);
                if (!group) return socket.emit('error', { message: 'Group not found' });

                // Add user to members
                if (userId && !group.members.includes(userId)) {
                    group.members.push(userId);
                    await group.save();
                }

                // Update activeNow count
                const roomSize = io.sockets.adapter.rooms.get(`group-${groupId}`)?.size || 1;
                await Group.findByIdAndUpdate(groupId, { activeNow: roomSize });

                // Load recent messages
                const messages = await Message.find({ groupId })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .populate('senderId', 'username avatar')
                    .lean();

                socket.emit('group_history', { 
                    groupId, 
                    messages: messages.reverse()
                });

                // Notify others
                io.to(`group-${groupId}`).emit('user_joined_group', {
                    groupId,
                    username,
                    onlineCount: roomSize
                });

            } catch (err) {
                console.error('❌ Join group error:', err);
            }
        });

        socket.on('send_group_message', async ({ groupId, content, type = 'text', fileUrl }) => {
            if (!userId) {
                return socket.emit('error', { message: 'Login required' });
            }

            try {
                const message = await Message.create({
                    groupId,
                    senderId: userId,
                    senderName: username,
                    content,
                    type,
                    fileUrl
                });

                // Update group's lastMessageAt
                await Group.findByIdAndUpdate(groupId, { lastMessageAt: new Date() });

                // Broadcast to all in group
                const populated = await Message.findById(message._id)
                    .populate('senderId', 'username avatar')
                    .lean();

                io.to(`group-${groupId}`).emit('receive_group_message', populated);

            } catch (err) {
                console.error('❌ Send message error:', err);
            }
        });

        socket.on('typing_group', ({ groupId, isTyping }) => {
            socket.to(`group-${groupId}`).emit('user_typing', {
                groupId,
                username,
                isTyping
            });
        });

        socket.on('leave_group', async ({ groupId }) => {
            socket.leave(`group-${groupId}`);
            
            const roomSize = io.sockets.adapter.rooms.get(`group-${groupId}`)?.size || 0;
            await Group.findByIdAndUpdate(groupId, { activeNow: roomSize });
            
            io.to(`group-${groupId}`).emit('user_left_group', {
                username,
                onlineCount: roomSize
            });
        });

        // ============ PRIVATE CHAT (1-1) ============
        socket.on('join_private_chat', async ({ targetUserId }) => {
            if (!userId) return;

            const roomId = [userId, targetUserId].sort().join('-');
            socket.join(`private-${roomId}`);

            try {
                // Load recent messages
                const messages = await PrivateMessage.find({ roomId })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .lean();

                socket.emit('private_chat_history', {
                    roomId,
                    messages: messages.reverse()
                });

                // Mark messages as read
                await PrivateMessage.updateMany(
                    { roomId, receiverId: userId, isRead: false },
                    { isRead: true }
                );

            } catch (err) {
                console.error('❌ Private chat error:', err);
            }
        });

        socket.on('send_private_message', async ({ targetUserId, content, type = 'text', fileUrl }) => {
            if (!userId) return;

            const roomId = [userId, targetUserId].sort().join('-');
            
            try {
                const message = await PrivateMessage.create({
                    roomId,
                    senderId: userId,
                    receiverId: targetUserId,
                    content,
                    type,
                    fileUrl
                });

                io.to(`private-${roomId}`).emit('receive_private_message', {
                    ...message.toObject(),
                    senderName: username
                });

                // Send push notification if target is offline
                if (!onlineUsers.has(targetUserId)) {
                    await Notification.create({
                        userId: targetUserId,
                        type: 'new_message',
                        title: 'New message',
                        message: `${username}: ${content.substring(0, 50)}`,
                        link: `/chat/${userId}`
                    });
                }

            } catch (err) {
                console.error('❌ Private message error:', err);
            }
        });

        // ============ ANSWERS ============
        socket.on('like_answer', async ({ answerId, action }) => {
            if (!userId) return;

            try {
                const answer = await Answer.findById(answerId);
                if (!answer) return;

                if (action === 'like') {
                    if (!answer.likes.includes(userId)) {
                        answer.likes.push(userId);
                        // Add reputation to author
                        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 1 } });
                    }
                } else {
                    answer.likes = answer.likes.filter(id => id.toString() !== userId);
                }

                await answer.save();

                io.emit('answer_updated', { 
                    answerId, 
                    likesCount: answer.likes.length 
                });

            } catch (err) {
                console.error('❌ Like error:', err);
            }
        });

        // ============ DISCONNECT ============
        socket.on('disconnect', async () => {
            console.log(`❌ ${username} disconnected`);

            if (userId) {
                onlineUsers.delete(userId);
                socketToUser.delete(socket.id);
                
                io.emit('user_offline', { userId, username });
                
                await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
            }
        });
    });

    return io;
}

export default initSockets;