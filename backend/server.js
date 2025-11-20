
import http from 'http';
import app from './src/app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initSockets from './src/sockets/index.js';

dotenv.config();

const server = http.createServer(app);
const io = initSockets(server);

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

/*     Endpoints
- `POST /auth/guest` { username }
- `POST /auth/register` { username, password }
- `GET /search?q=...`
- `GET /search/trending`
- `GET /groups/trending`
- `GET /groups/:id/messages`
- `POST /groups/:id/messages` (auth required)
- `POST /answers` (auth required)
- `POST /answers/:id/like` (auth required) */