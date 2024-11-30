import mongodb from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from a .env file if it exists
dotenv.config();

const { MongoClient } = mongodb;

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.database = this.client.db(database);

    // Connect to the database
    this.client.connect().catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
    });
  }

  isAlive() {
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    try {
      const usersCollection = this.database.collection('users');
      return await usersCollection.countDocuments();
    } catch (err) {
      console.error('Error fetching user count:', err);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const filesCollection = this.database.collection('files');
      return await filesCollection.countDocuments();
    } catch (err) {
      console.error('Error fetching file count:', err);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
