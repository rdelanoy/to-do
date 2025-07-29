import { NextRequest, NextResponse } from 'next/server';
import columnDao from '@/persistence/columns-dao';
import { verifyRequestToken } from '@/utils/auth';
import { ColumnMap, SwitchTaskColumn } from '@/types/types';

/**
 * Move a task from one column to another
 * @param request - Incoming PUT request containing task movement data
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify token from request
    const { valid, response } = await verifyRequestToken(request);
    if (!valid) return response;

    // Parse the task movement info (source and target columns)
    const switchTaskColumn: SwitchTaskColumn = await request.json();

    // Find source and destination columns
    let from = await columnDao.findColumnById(switchTaskColumn.from);
    let to = await columnDao.findColumnById(switchTaskColumn.to);

    // Remove task id from the source column
    from.taskIds = from.taskIds.filter((taskId) => taskId !== switchTaskColumn.taskId);
    await columnDao.update(from);

    // Add task id to the destination column
    to.taskIds.push(switchTaskColumn.taskId);
    await columnDao.update(to);

    // Build a map of all columns to return updated state
    const columnsArray = await columnDao.list();
    const columns: ColumnMap = columnsArray.reduce((acc, column) => {
      acc[column.id] = {
        id: column.id,
        index: column.index,
        title: column.title,
        status: column.status,
        taskIds: column.taskIds,
        _id: column._id,
      };
      return acc;
    }, {} as ColumnMap);

    return NextResponse.json(columns);
  } catch (error) {
    console.error('Error in PUT /api/columns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
