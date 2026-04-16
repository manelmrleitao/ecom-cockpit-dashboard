/**
 * Google OAuth Token Management
 * Handles token refresh with module-level caching to avoid unnecessary API calls
 */

interface TokenCache {
  accessToken: string
  expiresAt: number
}

let tokenCache: TokenCache | null = null

export async function refreshGoogleAccessToken(): Promise<string> {
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error(
      'Missing Google OAuth credentials. Please set GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CLIENT_ID, and GOOGLE_ADS_CLIENT_SECRET'
    )
  }

  // Check if cached token is still valid (with 5-minute buffer)
  if (tokenCache && tokenCache.expiresAt > Date.now() + 5 * 60 * 1000) {
    return tokenCache.accessToken
  }

  // Request new access token
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to refresh access token: ${error.error_description || error.error}`)
    }

    const data = await response.json()

    // Cache the token with expiry time
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
    }

    return data.access_token
  } catch (error) {
    console.error('Error refreshing Google access token:', error)
    throw error
  }
}

export function clearTokenCache(): void {
  tokenCache = null
}
