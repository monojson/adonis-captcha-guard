import { configProvider } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { RuntimeException } from '@poppinss/utils'
import type { ApplicationService } from '@adonisjs/core/types'

import type { CaptchaService } from '../src/types.js'
import { CaptchaManager } from '../src/captcha_manager.js'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    captcha: CaptchaService
  }
}

/**
 * CaptchaProvider extends the HTTP context with the "captcha" property
 */
export default class CaptchaProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const captchaConfigProvider = this.app.config.get<any>('captcha')

    const config = await configProvider.resolve<any>(this.app, captchaConfigProvider)
    if (!config) {
      throw new RuntimeException(
        'Invalid "config/captcha.ts" file. Make sure you are using the "defineConfig" method'
      )
    }

    /**
     * Setup HTTPContext getter
     */
    HttpContext.getter(
      'captcha',
      function (this: HttpContext) {
        return new CaptchaManager(config, this) as unknown as CaptchaService
      },
      true
    )
  }
}
