import { connect, ConnectOptions } from 'mongoose';

export default async function createSession() {
  const MONGO_URL = process.env.MONGO_URL || '';
  if (!MONGO_URL) {
    throw new Error('Missing MONGO_URL');
  }
  // https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
  const options: ConnectOptions = {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  };
  await connect(MONGO_URL, options);
}