import { NextRequest, NextResponse } from 'next/server';
import tokensDao from '@/persistence/token-dao';
import { verifyRequestToken } from '@/utils/auth';
import { validateTokenRecord } from '@/utils/api-validation';

/**
 * Handles user logout by deleting the provided token
 * @param request - Incoming POST request containing the token in headers
 */
export async function POST(request: NextRequest) {
  try {
    // Verify token from the request
    const { valid, response, token } = await verifyRequestToken(request);
    if (!valid) return response;

    // Validate if token exists in database
    const existingToken = await tokensDao.findToken(token!);
    const tokenValidation = validateTokenRecord(existingToken);
    if (!tokenValidation.valid) return tokenValidation.response;

    // Delete token from storage
    await tokensDao.deleteToken(token!);
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }

  // Return successful logout response
  return NextResponse.json({ success: true, message: 'Logged out' });
}
