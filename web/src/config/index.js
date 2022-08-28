const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: 'http://localhost:3000',
  },
  prod: {
    baseApi: '/',
  },
}

export default {
  env,
  mock: false,
  ...EnvConfig[env],
}
