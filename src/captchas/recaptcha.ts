import got from 'got'
import { RecaptchaConfig, RecaptchaValidateResult } from '../types.js'
import { Captcha } from './captcha.js'
import { HttpContext } from '@adonisjs/core/http'
import * as errors from '../errors.js'

/**
 * See more info about Google reCAPTCHA server-side validation: https://developers.google.com/recaptcha/docs/verify
 */
export class RecaptchaService extends Captcha {
    protected verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'

    protected tokenParamName = 'token'

    constructor(ctx: HttpContext, public config: RecaptchaConfig) {
      super(ctx, config)
    }

    public async validate(): Promise<RecaptchaValidateResult> {
        if (!this.hasToken()) {
          throw new errors.E_CAPTCHA_MISSING_TOKEN([this.tokenParamName])
        }
        
        console.log(this.config.secret)
        const token = this.getToken()
        const body = await got.post(
          this.verifyUrl,
          {
            form: {
              secret: this.config.secret,
              response: token,
            }
          }
        ).text()
        const decodeBody = JSON.parse(body)

        return {
          success: Boolean(decodeBody.success),
          challengeTimestamp: decodeBody.challenge_ts,
          hostname: decodeBody.hostname,
          errorCodes: decodeBody['error-codes'],
        } as RecaptchaValidateResult
    }
}