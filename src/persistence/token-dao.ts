import Datastore from 'nedb';
import path from 'path';
import { UserToken } from '@/types/types';

const db = new Datastore({
  filename: path.join(process.cwd(), 'data', 'tokens.db'),
  autoload: true,
});

type TokenDao = {
  // Save a new token with associated username
  saveToken: (token: string, username: string) => Promise<UserToken>;
  // Find a token by its value
  findToken: (token: string) => Promise<UserToken | null>;
  // Find all tokens associated with a username
  findTokensByUser: (username: string) => Promise<UserToken[]>;
  // Delete a token by its value
  deleteToken: (token: string) => Promise<number>;
};

const tokenDao: TokenDao = {
  saveToken: (token: string, username: string) => {
    return new Promise((resolve, reject) => {
      const doc: UserToken = { token, username, createdAt: Date.now() };
      db.insert(doc, (err: any, newDoc: UserToken) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  },

  findToken: (token: string) => {
    return new Promise((resolve, reject) => {
      db.findOne({ token }, (err: any, doc: UserToken | null) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  },

  findTokensByUser: (username: string) => {
    return new Promise((resolve, reject) => {
      db.find({ username }, (err: any, docs: UserToken[]) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  },

  deleteToken: (token: string) => {
    return new Promise((resolve, reject) => {
      db.remove({ token }, {}, (err: any, numRemoved: number) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  },
};

export default tokenDao;
