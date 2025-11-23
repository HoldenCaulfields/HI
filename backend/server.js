
import http from 'http';
import app from './src/app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initSockets from './src/sockets/index.js';

dotenv.config();

const server = http.createServer(app);
initSockets(server);

//connect mongodb:
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`HxI backend listening on port ${PORT}`);
});

/* API Endpoints Summary:
Auth:
POST /auth/guest          - Guest login
POST /auth/register       - Register account

Search:
GET  /search?q=query      - Main search
GET  /search/trending     - Trending keywords

Groups:
GET  /groups/trending     - List popular groups
GET  /groups/:id/messages - Get group messages
POST /groups/:id/messages - Send message (auth)

Answers:
POST /answers                  - Post answer (auth)
POST /answers/:id/like         - Like answer (auth)
POST /answers/:id/love         - Love answer (auth)
POST /answers/:id/comment      - Comment (auth)
GET  /answers/query/:query     - Get answers by query

Users:
GET  /users/top                - Top users by reputation
GET  /users/:username          - User profile
PATCH /users/profile           - Update profile (auth)

Notifications:
GET  /notifications            - Get notifications (auth)
PATCH /notifications/:id/read  - Mark as read (auth)
PATCH /notifications/read-all  - Mark all read (auth)

Socket.IO Events:
javascript// Client → Server
join_universe(query)
move_node({ query, nodeId, x, y })
join_group({ groupId })
send_group_message({ groupId, content, type })
typing_group({ groupId, isTyping })
join_private_chat({ targetUserId })
send_private_message({ targetUserId, content })
like_answer({ answerId, action })

// Server → Client
init_data({ nodes, links, theme })
node_moved({ nodeId, x, y })
group_history({ groupId, messages })
receive_group_message(message)
user_joined_group({ username, onlineCount })
user_typing({ username, isTyping })
private_chat_history({ messages })
receive_private_message(message)
answer_updated({ answerId, likesCount })
user_online({ userId, username })
user_offline({ userId }) */