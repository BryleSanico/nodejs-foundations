require('dotenv/config');
const createApp = require('./app');
const prisma = require('./db');

const app = createApp();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function shutdown() {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
