import { HttpContext } from '@adonisjs/core/http'
import { CaptchaConfig, CaptchaContract, ValidateResult } from '../types.js'

export abstract class Captcha implements CaptchaContract {
  protected abstract verifyUrl: string

  protected abstract tokenParamName: string

  constructor(protected ctx: HttpContext, public config: CaptchaConfig) {}

  validate(_token: string): Promise<ValidateResult> {
    throw new Error("Captcha validate method not implemented.")
  }

  getToken(): string | null {
    return this.ctx.request.input(this.tokenParamName, null)
  }

  hasToken(): boolean {
    return !!this.getToken()
  }

}