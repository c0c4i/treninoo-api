import axios from 'axios'

const CSRF_TOKEN_URL = 'https://www.lefrecce.it/Channels.Website.BFF.WEB/website/whitelist/enabled'

export type LeFrecceAuth = {
  token?: string
  cookie?: string
}

export default class LeFrecceService {
  private extractCookieHeader(setCookieHeader: unknown): string | undefined {
    if (!Array.isArray(setCookieHeader) || setCookieHeader.length === 0) return undefined

    const cookie = setCookieHeader.map((entry) => String(entry).split(';')[0]).join('; ')
    return cookie.length > 0 ? cookie : undefined
  }

  public async getToken(): Promise<LeFrecceAuth> {
    const tokenResponse = await axios.post(
      CSRF_TOKEN_URL,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const body = tokenResponse?.data
    const token =
      (typeof body?.token === 'string' && body.token.length > 0 && body.token) ||
      (typeof body?.csrfToken === 'string' && body.csrfToken.length > 0 && body.csrfToken) ||
      (typeof body === 'string' && body.length > 0 && body) ||
      undefined

    const cookie = this.extractCookieHeader(tokenResponse?.headers?.['set-cookie'])

    return {
      token,
      cookie,
    }
  }
}
