import { configProvider } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import type { ConfigProvider } from '@adonisjs/core/types'
import { CaptchaManagerFactory, RecaptchaConfig, TurnstileConfig } from './types.js'
import { TurnstileService } from './captchas/turnstile.js'
import { RecaptchaService } from './captchas/recaptcha.js'

/**
 * Shape of config after it has been resolved from
 * the config provider
 */
type ResolvedConfig<
CaptchaProviders extends Record<
    string,
    CaptchaManagerFactory | ConfigProvider<CaptchaManagerFactory>
  >,
> = {
  [K in keyof CaptchaProviders]: CaptchaProviders[K] extends ConfigProvider<infer A>
    ? A
    : CaptchaProviders[K]
}

/**
 * Define config for the captcha
 */
export function defineConfig<
CaptchaProviders extends Record<
    string,
    CaptchaManagerFactory | ConfigProvider<CaptchaManagerFactory>
  >,
>(config: CaptchaProviders): ConfigProvider<ResolvedConfig<CaptchaProviders>> {
  return configProvider.create(async (app) => {
    const serviceNames = Object.keys(config)
    const services = {} as Record<string, CaptchaManagerFactory>

    for (let serviceName of serviceNames) {
      const service = config[serviceName]
      if (typeof service === 'function') {
        services[serviceName] = service
      } else {
        services[serviceName] = await service.resolver(app)
      }
    }

    return services as ResolvedConfig<CaptchaProviders>
  })
}

/**
 * Helpers to configure captcha services
 */
export const services: {
  turnstile: (config: TurnstileConfig) => ConfigProvider<(ctx: HttpContext) => TurnstileService>
  recaptcha: (config: RecaptchaConfig) => ConfigProvider<(ctx: HttpContext) => RecaptchaService>
} = {
  turnstile(config) {
    return configProvider.create(async () => {
      const { TurnstileService } = await import('./captchas/turnstile.js')
      return (ctx) => new TurnstileService(ctx, config)
    })
  },
  recaptcha(config) {
    return configProvider.create(async () => {
      const { RecaptchaService } = await import('./captchas/recaptcha.js')
      return (ctx) => new RecaptchaService(ctx, config)
    })
  }
}
