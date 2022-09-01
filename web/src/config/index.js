const env = import.meta.env.MODE || 'prod'
export const TOKEN_KEY = 'XToken'
const EnvConfig = {
  dev: {
    baseApi: 'http://localhost:3000',
  },
  prod: {
    baseApi: 'http://175.178.115.221:3000',
  },
  production: 'http://175.178.115.221:3000'
}

export default {
  env,
  ...EnvConfig[env],
}
