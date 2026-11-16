require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');

(async () => {
  await connectDB(env.mongoUri);
  const server = app.listen(env.port, () => console.log(`Server listening on :${env.port}`));

  const shutdown = () =>
    server.close(async () => {
      await mongoose.connection.close(false);
      process.exit(0);
    });
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
})().catch((err) => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
