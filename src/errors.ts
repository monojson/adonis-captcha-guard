import { createError } from '@poppinss/utils'

export const E_CAPTCHA_MISSING_TOKEN = createError<[string]>(
  'Request is missing the "%s" param',
  'E_CAPTCHA_MISSING_TOKEN',
  400
)