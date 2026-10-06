import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

// Akamai in front of viaggiatreno.it rejects requests without a browser User-Agent
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

const PAUSE_MS = 15 * 60 * 1000
const MAX_ENTRIES = 5000

export const VT_TTL = {
  static: 24 * 60 * 60 * 1000,
  // Embeds the date of the current run, so it must turn over soon after midnight
  trainSearch: 5 * 60 * 1000,
  // The app polls train details and station boards every 10s
  realtime: 10 * 1000,
  news: 5 * 60 * 1000,
}

const http = axios.create({
  timeout: 15000,
  validateStatus: () => true,
  headers: {
    'User-Agent': Env.get('VT_USER_AGENT') || CHROME_UA,
    // JSON preferred; the autocomplete and RSS endpoints return 406 without text/plain or */*
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'it-IT,it;q=0.9',
  },
})

// ponytail: in-process cache, fine for the single container; move to Redis if we scale out
const cache = new Map<string, { data: unknown; expiresAt: number }>()
const inflight = new Map<string, Promise<unknown>>()
let pausedUntil = 0

export class ViaggiaTrenoUnavailableException extends Exception {
  constructor(public retryAfter: number) {
    super('ViaggiaTreno is temporarily unavailable', 503, 'E_VIAGGIATRENO_UNAVAILABLE')
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response
      .header('Retry-After', String(error.retryAfter))
      .status(503)
      .send({ error: error.message })
  }
}

/**
 * GET a ViaggiaTreno URL through the shared cache. `key` defaults to the URL; pass a
 * stable one when the URL embeds a timestamp, so stale data stays reachable.
 */
export async function vtGet<T = any>(url: string, ttlMs: number, key = url): Promise<T> {
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.data as T
  if (Date.now() < pausedUntil) return staleOrThrow(key) as T

  let pending = inflight.get(key)
  if (!pending) {
    pending = fetchUpstream(url, ttlMs, key).finally(() => inflight.delete(key))
    inflight.set(key, pending)
  }
  return pending as Promise<T>
}

async function fetchUpstream(url: string, ttlMs: number, key: string) {
  const res = await http.get(url)
  Logger.info({ status: res.status, url }, 'viaggiatreno upstream')

  if (res.status === 403 || res.status === 429) {
    pausedUntil = Date.now() + PAUSE_MS
    Logger.warn('viaggiatreno returned %d, pausing upstream calls for 15 minutes', res.status)
    return staleOrThrow(key)
  }
  if (res.status >= 400) throw new Error(`viaggiatreno responded ${res.status} for ${url}`)

  // Re-insert so Map order tracks recency, then evict the oldest entry past the cap
  cache.delete(key)
  cache.set(key, { data: res.data, expiresAt: Date.now() + ttlMs })
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!)
  return res.data
}

function staleOrThrow(key: string) {
  const stale = cache.get(key)
  if (stale) return stale.data
  throw new ViaggiaTrenoUnavailableException(Math.ceil((pausedUntil - Date.now()) / 1000))
}
