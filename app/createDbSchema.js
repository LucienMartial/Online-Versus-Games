import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL;
const dbName = 'online-versus-game';

async function createCollections() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connecté avec succès à la base de données');

    const db = client.db(dbName);

    // const collectionOptions = {
    //     validator: {
    //       $jsonSchema: {
    //         bsonType: 'object',
    //         required: ['nom', 'age'],
    //         properties: {
    //           nom: {
    //             bsonType: 'string',
    //             description: 'Doit être une chaîne de caractères'
    //           },
    //           age: {
    //             bsonType: 'number',
    //             description: 'Doit être un nombre'
    //           }
    //         }
    //       }
    //     }
    //   };
  
    //   await db.createCollection('ma_collection', collectionOptions);
  
    //   const collection = db.collection('ma_collection');
    //   await collection.createIndex({ nom: 1 });
    //   await collection.createIndex({ age: 1 });

    await db.createCollection('users');
    await db.createCollection('friend-requests');
    await db.createCollection('friends');
    await db.createCollection('games');
    await db.createCollection('profiles');
    await db.createCollection('tag-games');
    await db.createCollection('tag-profiles');
    await db.createCollection('user-shops');
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  } finally {
    client.close();
  }
}

createCollections();
