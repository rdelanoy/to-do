import { NextRequest, NextResponse } from 'next/server';
import taskDao from '@/persistence/task-dao';
import { Task, TasksMap } from '@/types/types';
import columnDao from '@/persistence/columns-dao';
import { verifyRequestToken } from '@/utils/auth';
import tokenDao from '@/persistence/token-dao';

/**
 * Create a new task and add it to a specific column
 * @param request - Incoming POST request containing task and column ID
 */
export async function POST(request: NextRequest) {

  try {

    // Verify request token
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Extract task and target column ID
    const { task, columnId } = await request.json();

    // Get user from token and set as task owner
    const tokenRecord = await tokenDao.findToken(token!);
    const username = tokenRecord?.username;
    task.owner = username;

    // Save task to database
    const savedTask = await taskDao.saveTask(task);

    // Add task ID to the specified column
    let column = await columnDao.findColumnById(columnId);
    column.taskIds.push(savedTask.id);
    await columnDao.update(column);

    // Mark task as no longer new before returning
    savedTask.isNew = false;

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    console.error('Error saving task:', error);
    return NextResponse.json({ error: 'Failed to save task' }, { status: 500 });
  }
}

/**
 * Update an existing task
 * @param request - Incoming PUT request containing updated task data
 * @param params - Route parameters containing task ID
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify request token
    const { valid, response } = await verifyRequestToken(request);
    if (!valid) return response;

    // Get task ID from params and updated data from body
    const taskId = params.id;
    const task: Task = await request.json();

    // Validate task ID consistency
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
 * Delete a task and remove it from its column
 * @param request - Incoming DELETE request
 * @param params - Route parameters containing task ID to delete
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

  try {

    // Verify request token
    const { valid, response } = await verifyRequestToken(request);
    if (!valid) return response;

    // Delete task from database
    const taskIdToDelete = params.id;
    await taskDao.deleteTask(taskIdToDelete);

    // Remove task ID from its parent column
    const column = await columnDao.findColumnByTaskId(taskIdToDelete);
    column.taskIds = column.taskIds.filter((taskId) => taskId !== taskIdToDelete);
    await columnDao.update(column);

    return NextResponse.json(taskIdToDelete);
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

/**
 * Get all tasks owned by the authenticated user
 * @param request - Incoming GET request
 */
export async function GET(request: NextRequest) {
  
  try {

    // Verify request token
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Get username from token
    const tokenRecord = await tokenDao.findToken(token!);
    const username = tokenRecord?.username;

    // Retrieve all tasks for the user
    const tasksArray = await taskDao.findByOwner(username!);

    // Build and return a map of tasks
    const tasks: TasksMap = tasksArray.reduce((acc, task) => {
      acc[task.id] = {
        id: task.id,
        title: task.title,
        content: task.content,
        isFavorite: task.isFavorite,
        owner: task.owner,
      };
      return acc;
    }, {} as TasksMap);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error in GET /api/columns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
