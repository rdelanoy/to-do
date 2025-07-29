import tokenDao from '@/persistence/token-dao';
import { ResponseValidation, VerifyOtpResult } from '@/types/types';
import { authenticator } from '@otplib/preset-default';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Verifies the presence and validity of a bearer token
 */
export async function verifyRequestToken(request: NextRequest): Promise<ResponseValidation> {
  try {
    const token = extractBearerToken(request);
    if (!token) return unauthorizedResponse();

    const tokenRecord = await fetchTokenRecord(token);
    if (!tokenRecord) return invalidTokenResponse();

    return { valid: true, token };
  } catch (error) {
    return internalServerErrorResponse();
  }
}

// Verifies OTP validity from request body
export async function verifyRequestOtp(otp: string): Promise<VerifyOtpResult> {

  try {

    //const { otp } = await request.json();
    
    const secret = process.env.SECRET_KEY!;

    const isValid = validateOtpToken(otp, secret);

    if (!isValid) return invalidOtpResponse();

    return { valid: true };

  } catch (error) {
    return internalServerErrorResponse();
  }
}

/* ----------------------------------------
   Helper functions for readability
-------------------------------------------*/

/** Extract Bearer token from Authorization header */
function extractBearerToken(request: NextRequest) {
  return request.headers.get('Authorization')?.replace('Bearer ', '');
}

/** Fetch token record from DB */
async function fetchTokenRecord(token: string) {
  const record = await tokenDao.findToken(token);
  return record && typeof record === 'object' ? record : null;
}

// Validate OTP with given secret
function validateOtpToken(otp: string, secret: string) {
  authenticator.options = { step: 30, digits: 8, window: 3 };
  return authenticator.verify({ token: otp, secret });
}

// ------------ Standard responses ----------

function unauthorizedResponse() {
  return {
    valid: false,
    response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  };
}

function invalidTokenResponse() {
  return {
    valid: false,
    response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 }),
  };
}

function invalidOtpResponse() {
  return {
    valid: false,
    response: NextResponse.json({ error: 'Invalid or missing OTP' }, { status: 401 }),
  };
}

function internalServerErrorResponse() {
  return {
    valid: false,
    response: NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }),
  };
}
