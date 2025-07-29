import { NextRequest, NextResponse } from 'next/server';
import columnDao from '@/persistence/columns-dao';
import tokenDao from '@/persistence/token-dao';
import { verifyRequestToken } from '@/utils/auth';
import { ColumnMap, SwitchTaskColumn } from '@/types/types';
import { validateTokenRecord } from '@/utils/api-validation';

/**
 * Handles task movement between columns
 * @param request - Incoming PUT request containing task movement data
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify token from the request
    const { valid, response } = await verifyRequestToken(request);
    if (!valid) return response;

    // Get task movement info (source and target columns)
    const switchTaskColumn: SwitchTaskColumn = await request.json();

    // Find source and destination columns
    let from = await columnDao.findColumnById(switchTaskColumn.from);
    let to = await columnDao.findColumnById(switchTaskColumn.to);

    // Remove task from source column
    from.taskIds = from.taskIds.filter((taskId) => taskId !== switchTaskColumn.taskId);
    await columnDao.update(from);

    // Add task to destination column
    to.taskIds.push(switchTaskColumn.taskId);
    await columnDao.update(to);

    // Build updated columns map
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

/**
 * Retrieves all columns for the authenticated user
 * @param request - Incoming GET request containing token in headers
 */
export async function GET(request: NextRequest) {

  try {
    
    // Verify token from the request
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Check if token exists in database
    const tokenRecord = await tokenDao.findToken(token!);
    const validateResult = validateTokenRecord(tokenRecord);
    if (!validateResult.valid) 
      return validateResult.response;

    // Build and return columns map
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
    console.error('Error in GET /api/columns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Generic data checker
 * @param data - The value to validate
 * @param errorMessage - The message returned in case of invalid data
 * @param statusCode - The HTTP status code for the response
 */
export function checkData(
  data: unknown,
  errorMessage: string,
  statusCode: number
) {
  if (!data || (typeof data === 'string' && data.trim() === '') || data === null) {
    return {
      valid: false,
      response: NextResponse.json({ error: errorMessage }, { status: statusCode }),
    };
  }

  return { valid: true };
}
