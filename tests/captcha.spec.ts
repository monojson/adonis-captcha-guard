import { test } from '@japa/runner'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { CaptchaManager } from '../src/captcha_manager.js'
import { TurnstileService } from '../src/captchas/turnstile.js'
import { RecaptchaService } from '../src/captchas/recaptcha.js'

test.group('Captcha services', () => {
  test('Cloudflare turnstile captcha service', async({ assert }) => {
    const toValidateToken = ''
    const ctx = new HttpContextFactory().create()
    ctx.request.updateQs({
      token: toValidateToken
    })
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

    const validateResult = await captcha.use('turnstile').validate()
    console.log(validateResult)
    assert.isTrue(validateResult.success)
  })

  test('Google reCAPTCHA captcha service', async ({ assert }) => {
    const toValidateToken = ''
    const ctx = new HttpContextFactory().create()
    ctx.request.updateQs({
      token: toValidateToken
    })
    const captcha = new CaptchaManager(
      {
        recaptcha: ($ctx) => {
          return new RecaptchaService($ctx, {
            siteKey: '',
            secret: '',
          })
        },
      },
      ctx
    )

    const validateResult = await captcha.use('recaptcha').validate()
    console.log(validateResult)
    assert.isTrue(validateResult.success)
  })
})
