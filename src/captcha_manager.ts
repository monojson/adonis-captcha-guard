import { RuntimeException } from '@poppinss/utils'
import type { HttpContext } from '@adonisjs/core/http'
import { CaptchaContract, CaptchaManagerFactory } from './types.js'

export class CaptchaManager<CaptchaProviders extends Record<string, CaptchaManagerFactory>> {
  /**
   * Config with the list of captcha providers
   */
  #config: CaptchaProviders
  #ctx: HttpContext
  #driversCache: Map<keyof CaptchaProviders, CaptchaContract> = new Map()

  constructor(config: CaptchaProviders, ctx: HttpContext) {
    this.#ctx = ctx
    this.#config = config
  }

  /**
   * Returns the instance of a captcha provider
   */
  use<CaptchaProvider extends keyof CaptchaProviders>(
    provider: CaptchaProvider
  ): ReturnType<CaptchaProviders[CaptchaProvider]> {
    if (this.#driversCache.has(provider)) {
      return this.#driversCache.get(provider) as ReturnType<CaptchaProviders[CaptchaProvider]>
    }

    const driver = this.#config[provider]
    if (!driver) {
      throw new RuntimeException(
        `Unknown captcha provider "${String(
          provider
        )}". Make sure it is registered inside the config/captcha.ts file`
      )
    }

    const driverInstance = driver(this.#ctx) as ReturnType<CaptchaProviders[CaptchaProvider]>
    this.#driversCache.set(provider, driverInstance)

    return driverInstance
  }
}
