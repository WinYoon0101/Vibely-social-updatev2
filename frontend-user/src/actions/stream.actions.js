'use server';

import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    throw new Error('Stream API key or secret is missing');
  }

  const streamClient = new StreamClient(
    STREAM_API_KEY,
    STREAM_API_SECRET
  );

  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  return streamClient.createToken(userId, expirationTime, issuedAt);
};
