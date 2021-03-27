const sveltePreprocess = require('svelte-preprocess')

module.exports = {
  preprocess: sveltePreprocess({
    defaults: {
      script: 'typescript',
    },
    scss: {
      includePaths: ['app/theme'],
    },
    replace : [['__REDCOLOR' , 'red']]
  }),
  hotReload: false,
}
