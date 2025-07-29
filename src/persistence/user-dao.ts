import { User } from '@/types/types';
import Datastore from 'nedb';
import path from 'path';

const db = new Datastore({
  filename: path.join(process.cwd(), 'data', 'user.db'),
  autoload: true,
});

type UserDao = {
  // Save a new user
  saveUser: (user: User) => Promise<unknown>;
  // Find a user by email
  findUser: (email: string) => Promise<unknown>;
};

const userDao: UserDao = {
  saveUser: (user: User) => {
    return new Promise((resolve, reject) => {
      db.insert(user, (err: any, newDoc: unknown) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  },

  findUser: (email: string) => {
    return new Promise((resolve, reject) => {
      db.findOne({ email }, (err: any, doc: unknown) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  },
};

export default userDao;
