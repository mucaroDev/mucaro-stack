import type { NextRequest } from 'next/server';

// Simple auth handler for Clerk webhooks
export function POST(_request: NextRequest) {
  // For now, just return success to handle the webhook
  // This can be expanded later to sync user data
  return new Response('OK', { status: 200 });
}

export function GET() {
  return new Response('Auth endpoint', { status: 200 });
}
