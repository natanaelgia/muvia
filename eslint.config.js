import { configApp } from '@adonisjs/eslint-config'

const config = configApp()

// Override filename-case rule to use CamelCase per project rules
config.push({
  rules: {
    '@unicorn/filename-case': 'off',
  },
})

export default config
