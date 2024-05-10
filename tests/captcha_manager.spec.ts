import { test } from '@japa/runner'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { CaptchaManager } from '../src/captcha_manager.js'
import { TurnstileService } from '../src/captchas/turnstile.js'

test.group('Captcha manager', () => {
  test('create an instance of a captcha provider', ({ assert, expectTypeOf }) => {
    const ctx = new HttpContextFactory().create()

    const captcha = new CaptchaManager(
      {
        turnstile: ($ctx) => {
          return new TurnstileService($ctx, {
            siteKey: '',
            secret: '',
          })
        },
      },
      ctx
    )

    assert.instanceOf(captcha.use('turnstile'), TurnstileService)
    assert.strictEqual(captcha.use('turnstile'), captcha.use('turnstile'))
    expectTypeOf(captcha.use).parameters.toEqualTypeOf<['turnstile']>()
    expectTypeOf(captcha.use('turnstile')).toMatchTypeOf<TurnstileService>()
  })

  test('throw error when making an unknown captcha provider', () => {
    const ctx = new HttpContextFactory().create()

    const captcha = new CaptchaManager({}, ctx)
    ;(captcha.use as any)('turnstile')
  }).throws(
    'Unknown captcha provider "turnstile". Make sure it is registered inside the config/captcha.ts file'
  )
})
