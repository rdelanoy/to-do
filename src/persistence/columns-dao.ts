import { Column, Task } from '@/types/types';
import Datastore from 'nedb';
import path from 'path';

// Initialize the database
const db = new Datastore({
  filename: path.join(process.cwd(), 'data', 'columns.db'),
  autoload: true,
});

type ColumnDao = {
  list: () => Promise<Column[]>;
  save: (column: Column) => Promise<Column>;
  update: (column: Column) => Promise<Column>;
  findColumnById: (id: string) => Promise<Column>;
  findColumnByTaskId: (id: string) => Promise<Column>;
};

const columnDao: ColumnDao = {
  // List all columns sorted by index ascending
  list: () => {
    return new Promise((resolve, reject) => {
      db.find({})
        .sort({ index: 1 }) // 1 = ascending, -1 = descending
        .exec((err: any, docs: Column[]) => {
          if (err) reject(err);
          else resolve(docs);
        });
    });
  },

  // Save a new column
  save: (column: Column) => {
    return new Promise((resolve, reject) => {
      db.insert(column, (err, newDoc: Column) => {
        if (err) reject(err);
        else resolve(newDoc);
      });
    });
  },

  // Find a column by its id
  findColumnById: (id: string) => {
    return new Promise((resolve, reject) => {
      db.findOne({ id }, (err: any, column: Column) => {
        if (err) reject(err);
        else resolve(column);
      });
    });
  },

  // Find a column that contains a given taskId in taskIds array
  findColumnByTaskId: (taskId: string) => {
    return new Promise((resolve, reject) => {
      db.findOne({ taskIds: taskId }, (err: any, column: Column) => {
        if (err) reject(err);
        else resolve(column);
      });
    });
  },

  // Update an existing column by _id and id
  update: (column: Column) => {
    return new Promise((resolve, reject) => {
      db.update(
        { _id: column._id, id: column.id },
        { $set: column },
        {},
        (err: Error | null, numAffected: number) => {
          if (err) reject(err);
          else resolve(column);
        }
      );
    });
  },
};

export default columnDao;
