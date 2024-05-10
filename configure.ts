import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import pkg from './package.json'
const packageName = pkg.name

export async function configure(command: ConfigureCommand) {
    const codemods = await command.createCodemods()

    const providers = ['turnstile', 'recaptcha']
    await codemods.makeUsingStub(stubsRoot, 'config/captcha.stub', {
        providers: providers.map((provider) => {
            return { provider, envPrefix: provider.toUpperCase() }
        }),
    })

    await codemods.updateRcFile((rcFile) => {
        rcFile.addProvider(`${packageName}/providers/captcha_provider`)
    })

    await codemods.defineEnvVariables(
        providers.reduce<Record<string, string>>((result, provider) => {
            result[`${provider.toUpperCase()}_SITE_KEY`] = ''
            result[`${provider.toUpperCase()}_SECRET`] = ''
            return result
        }, {})
    )

    await codemods.defineEnvValidations({
        variables: providers.reduce<Record<string, string>>((result, provider) => {
            result[`${provider.toUpperCase()}_SITE_KEY`] = 'Env.schema.string()'
            result[`${provider.toUpperCase()}_SECRET`] = 'Env.schema.string()'
            return result
        }, {})
    })
}
