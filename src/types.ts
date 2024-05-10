import { HttpContext } from '@adonisjs/core/http'
import { ConfigProvider } from '@adonisjs/core/types'
import { CaptchaManager } from './captcha_manager.js'

export interface CaptchaContract {
    validate(token: string): Promise<ValidateResult>
}

export type ValidateResult = {
    /**
         * true when the token is valid
         */
    success: boolean

    /**
     * the ISO timestamp for the time the challenge was solved
     */
    challengeTimestamp?: string
}

export type TurnstileValidateResult = ValidateResult & {
    /**
     * the hostname for which the challenge was served
     */
    hostname?: string

    /**
     * a list of errors that occurred
     */
    errorCodes?: TurnstileErrorCode[]

    /**
     * the customer widget identifier passed to the widget on the client side
     */
    action?: string

    /**
     * the customer data passed to the widget on the client side
     */
    cdata?: string
}

export type RecaptchaValidateResult = ValidateResult & {
    /**
     * the hostname for which the challenge was served
     */
    hostname?: string

    /**
     * a list of errors that occurred
     */
    errorCodes?: RecaptchaErrorCode[]
}

export type CaptchaConfig = {
    siteKey: string
    secret: string
}

export type TurnstileConfig = CaptchaConfig

export type RecaptchaConfig = CaptchaConfig

export type TurnstileErrorCode =
    | 'missing-input-secret'
    | 'invalid-input-secret'
    | 'missing-input-response'
    | 'invalid-input-response'
    | 'invalid-widget-id'
    | 'invalid-parsed-secret'
    | 'bad-request'
    | 'timeout-or-duplicate'
    | 'internal-error'

export type RecaptchaErrorCode =
    | 'missing-input-secret'
    | 'invalid-input-secret'
    | 'missing-input-response'
    | 'invalid-input-response'
    | 'bad-request'
    | 'timeout-or-duplicate'

export type CaptchaManagerFactory = (ctx: HttpContext) => CaptchaContract


/**
 * Captcha providers are inferred inside the user application
 * from the config file
 */
export interface CaptchaProviders {}
export type InferCaptchaProviders<
  T extends ConfigProvider<Record<string, CaptchaManagerFactory>>,
> = Awaited<ReturnType<T['resolver']>>

/**
 * Captcha service is shared with the HTTP context
 */
export interface CaptchaService
  extends CaptchaManager<
  CaptchaProviders extends Record<string, CaptchaManagerFactory> ? CaptchaProviders : never
  > {}