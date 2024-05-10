import got from 'got'
import { TurnstileConfig, TurnstileValidateResult } from '../types.js'
import { Captcha } from './captcha.js'
import { HttpContext } from '@adonisjs/core/http'
import * as errors from '../errors.js'

/**
 * See more info about Cloudflare Turnstile server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export class TurnstileService extends Captcha {
    protected verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

    protected tokenParamName = 'token'

    constructor(ctx: HttpContext, public config: TurnstileConfig) {
        super(ctx, config)
    }

    public async validate(): Promise<TurnstileValidateResult> {
        if (!this.hasToken()) {
            throw new errors.E_CAPTCHA_MISSING_TOKEN([this.tokenParamName])
        }

        const token = this.getToken()
        const body = await got.post(
          this.verifyUrl,
          {
            json: {
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
          action: decodeBody.action,
          cdata: decodeBody.cdata,
        } as TurnstileValidateResult
    }
}