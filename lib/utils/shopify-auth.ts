/**
 * Shopify OAuth Authentication
 * Generates access tokens using Client Credentials Grant
 */

let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Gets or refreshes a Shopify access token
 * Uses Client Credentials Grant to exchange Client ID + Secret for access token
 */
export async function getShopifyAccessToken(): Promise<string> {
  const now = Date.now()

  // Return cached token if still valid (refresh 5 min before expiry)
  if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET
  const storeUrl = process.env.SHOPIFY_STORE_URL

  if (!clientId || !clientSecret || !storeUrl) {
    throw new Error(
      'Missing Shopify credentials: SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOPIFY_STORE_URL'
    )
  }

  try {
    const response = await fetch(`https://${new URL(storeUrl).hostname}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Shopify OAuth failed: ${response.status} - ${error}`)
    }

    const data = (await response.json()) as {
      access_token: string
      expires_in: number
    }

    // Cache token (expires_in is in seconds)
    cachedToken = {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    }

    return data.access_token
  } catch (error) {
    throw new Error(
      `Failed to get Shopify access token: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
