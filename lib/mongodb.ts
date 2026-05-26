/**
 * MongoDB Connection Utility
 * 
 * This module manages the connection to MongoDB using Mongoose.
 * It implements a singleton pattern to prevent multiple connections in 
 * development/serverless environments (like Next.js API routes).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the connection string is provided
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global interface for Mongoose connection caching.
 * Prevents re-connecting to the database on every hot reload in development.
 */
interface GlobalMongoose {
  mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

const globalWithMongoose = global as unknown as GlobalMongoose;

// Initialize the global mongoose object if it doesn't exist
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * connectToDatabase
 * 
 * Establishes or retrieves a cached connection to MongoDB.
 * @returns {Promise<mongoose.Connection>} The Mongoose connection object.
 */
async function connectToDatabase() {
  // Return the existing connection if available
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  // If no connection is in progress, create a new promise
  if (!globalWithMongoose.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  // Wait for the connection promise to resolve
  try {
    globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  } catch (e) {
    // Reset promise if connection fails so subsequent attempts can retry
    globalWithMongoose.mongoose.promise = null;
    throw e;
  }

  return globalWithMongoose.mongoose.conn;
}

export default connectToDatabase;
