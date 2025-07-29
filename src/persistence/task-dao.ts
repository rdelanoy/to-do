import { Task } from '@/types/types';
import Datastore from 'nedb';
import path from 'path';

const db = new Datastore({
  filename: path.join(process.cwd(), 'data', 'tasks.db'),
  autoload: true,
});

type TaskDao = {
  saveTask: (task: Task) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (id: string) => Promise<Task>;
  findByOwner: (ownerEmail: string) => Promise<Task[]>;
  findByColumn: (columnId: string) => Promise<Task[]>;
  findByColumnAndOwner: (columnId: string, ownerEmail: string) => Promise<Task[]>;
};

const taskDao: TaskDao = {
  // Save a new task
  saveTask: (task: Task) => {
    return new Promise((resolve, reject) => {
      db.insert(task, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  },

  // Update an existing task by id
  updateTask: (task: Task) => {
    return new Promise((resolve, reject) => {
      db.update({ id: task.id }, { $set: task }, {}, (err, numUpdated) => {
        if (err) reject(err);
        else resolve(task);
      });
    });
  },

  // Delete a task by id
  deleteTask: (id: string) => {
    return new Promise((resolve, reject) => {
      db.remove({ id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve({ id } as unknown as Task); // returning id as a placeholder
      });
    });
  },

  // Find tasks by owner email
  findByOwner: (ownerEmail: string) => {
    return new Promise((resolve, reject) => {
      db.find({ owner: ownerEmail }, (err: any, docs: Task[]) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  },

  // Find tasks by column id
  findByColumn: (columnId: string) => {
    return new Promise((resolve, reject) => {
      db.find({ columnId }, (err: any, docs: Task[]) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  },

  // Find tasks by column id and owner email
  findByColumnAndOwner: (columnId: string, ownerEmail: string) => {
    return new Promise((resolve, reject) => {
      db.find({ columnId, owner: ownerEmail }, (err: any, docs: Task[]) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
};

export default taskDao;
