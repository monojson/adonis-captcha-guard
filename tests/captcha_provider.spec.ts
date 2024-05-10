import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

import { defineConfig, services } from '../src/define_config.js'
import { CaptchaManager } from '../src/captcha_manager.js'

const BASE_URL = new URL('./tmp/', import.meta.url)

test.group('Captcha provider', () => {
  test('define HttpContext.captcha property', async ({ assert }) => {
    const ignitor = new IgnitorFactory()
      .merge({
        rcFileContents: {
          providers: [() => import('../providers/captcha_provider.js')],
        },
      })
      .withCoreConfig()
      .withCoreProviders()
      .merge({
        config: {
          captcha: defineConfig({
            github: services.turnstile({
              siteKey: '',
              secret: '',
            }),
          }),
        },
      })
      .create(BASE_URL)

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    const ctx = new HttpContextFactory().create()
    assert.instanceOf(ctx.captcha, CaptchaManager)
    assert.strictEqual(ctx.captcha, ctx.captcha)
  })
})
