import tokenDao from '@/persistence/token-dao';
import userDao from '@/persistence/user-dao';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestOtp } from '@/utils/auth';
import { handleUserNotFound, validateEmail } from '@/utils/api-validation';

/**
 * Handles user authentication using OTP
 * @param request - Incoming POST request containing email and otp
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate inputs
    const validatedEmail = validateEmail(email);
    if (!validatedEmail.valid) return validatedEmail.response;

    // Verify OTP from request
    const { valid, response } = await verifyRequestOtp(otp);
    if (!valid) return response;

    // Check user
    const user = await userDao.findUser(email);
    if (!user) return handleUserNotFound();

    // Generate token and save
    const token = randomUUID();
    await tokenDao.saveToken(token, email);

    return NextResponse.json({ success: true, token, user });
    
  } catch (error) {
    console.error('POST /auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
