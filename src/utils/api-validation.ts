import { ResponseValidation } from "@/types/types";
import { NextResponse } from "next/server";

/**
 * Validate if the provided email is a valid string
 * @param email - The email address to validate
 * @returns ResponseValidation object
 */
export function validateEmail(email: string): ResponseValidation {
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      response: NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 }),
    };
  }
  return { valid: true };
}

/**
 * Returns a standardized response for a user not found error
 * @returns NextResponse with a 404 status code
 */
export function handleUserNotFound() {
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

/**
 * Generic data checker
 * @param data - The value to validate
 * @param errorMessage - The error message to return if validation fails
 * @param statusCode - HTTP status code for the error response
 * @returns ResponseValidation object
 */
export function checkData(
  data: unknown,
  errorMessage: string,
  statusCode: number
): ResponseValidation {
  if (!data || (typeof data === 'string' && data.trim() === '') || data === null) {
    return {
      valid: false,
      response: NextResponse.json({ error: errorMessage }, { status: statusCode }),
    };
  }

  return { valid: true };
}

/**
 * Validate if the provided token record exists and is an object
 * @param tokenRecord - The token record to validate
 * @returns ResponseValidation object
 */
export function validateTokenRecord(tokenRecord: unknown): ResponseValidation {
  if (!tokenRecord || typeof tokenRecord !== 'object') {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 403 }
      ),
    };
  }
  return { valid: true };
}
