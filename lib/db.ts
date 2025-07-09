import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose's buffering of commands
      maxPoolSize: 10, // Set the maximum number of connections in the pool
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset the promise on error
    throw error;
  }
  return cached.conn;
}
