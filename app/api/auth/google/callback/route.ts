/**
 * Google OAuth Callback Route
 * Handles OAuth2 callback and exchanges code for refresh token (one-time setup)
 * 
 * Usage:
 * 1. Visit this URL with code param from OAuth flow:
 *    /api/auth/google/callback?code=xxx&state=yyy
 * 
 * 2. Response will contain refresh_token - save it to .env.local as GOOGLE_ADS_REFRESH_TOKEN
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Handle OAuth error
  if (error) {
    return NextResponse.json(
      { error: `OAuth error: ${error}` },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    )
  }

  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Missing Google OAuth credentials in environment' },
      { status: 500 }
    )
  }

  try {
    // Exchange code for tokens
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Token exchange failed: ${error.error_description || error.error}`)
    }

    const tokens = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Authorization successful! Save the refresh_token to .env.local',
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
      instructions: {
        step1: 'Copy the refresh_token value above',
        step2: 'Add to .env.local: GOOGLE_ADS_REFRESH_TOKEN=<value>',
        step3: 'Restart your development server',
        step4: 'Google Ads API is now configured',
      },
    })
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: `Failed to process OAuth callback: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
