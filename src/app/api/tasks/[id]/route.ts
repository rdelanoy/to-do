import { NextRequest, NextResponse } from 'next/server';
import taskDao from '@/persistence/task-dao';
import { Task } from '@/types/types';
import columnDao from '@/persistence/columns-dao';
import { verifyRequestToken } from '@/utils/auth';
import tokenDao from '@/persistence/token-dao';
import { validateTokenRecord } from '@/utils/api-validation';

/**
 * Create a new task
 * @param request - Incoming POST request containing task data
 */
export async function POST(request: NextRequest) {
  
  try {

    // Verify request token
    const { valid, response } = await verifyRequestToken(request);
    if (!valid) return response;

    // Parse task data from request body
    const task: Task = await request.json();

    // Save task to database
    const savedTask = await taskDao.saveTask(task);

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    console.error('Error saving task:', error);
    return NextResponse.json({ error: 'Failed to save task' }, { status: 500 });
  }
}

/**
 * Update an existing task
 * @param request - Incoming PUT request containing updated task data
 * @param params - Route parameters containing task id
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {

    // Verify request token
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Validate token record
    const tokenRecord = await tokenDao.findToken(token!);
    const tokenValidation = validateTokenRecord(tokenRecord);
    if (!tokenValidation.valid) return tokenValidation.response;

    // Get task id from params and updated task data from body
    const taskId = params.id;
    const task: Task = await request.json();

    // Ensure the task id matches the URL param
    if (task.id !== taskId) {
      return NextResponse.json({ error: 'ID mismatch' }, { status: 400 });
    }

    // Update task in database
    await taskDao.updateTask(task);

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

/**
 * Delete a task
 * @param request - Incoming DELETE request
 * @param params - Route parameters containing task id to delete
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify request token
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Validate token record
    const tokenRecord = await tokenDao.findToken(token!);
    const tokenValidation = validateTokenRecord(tokenRecord);
    if (!tokenValidation.valid) return tokenValidation.response;

    // Get task id to delete from params
    const taskIdToDelete = params.id;

    // Delete task from database
    await taskDao.deleteTask(taskIdToDelete);

    // Find the column that contained the deleted task
    const column = await columnDao.findColumnByTaskId(taskIdToDelete);

    // Remove task id reference from the column
    column.taskIds = column.taskIds.filter((taskId) => taskId !== taskIdToDelete);

    // Update column in database
    await columnDao.update(column);

    return NextResponse.json(taskIdToDelete);
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
