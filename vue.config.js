const path = require('path')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())

function resolve (dir) {
  return path.join(__dirname, dir)
}

// check Git
function getGitHash () {
  try {
    return GitRevision.version()
  } catch (error) {}
  return 'unknown'
}

// vue.config.js
const vueConfig = {
  assetsDir: 'static',

  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ],
    externals: {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
    proxy: {
      '/n1/api': {
        target: 'http://192.168.2.130:9091',
        pathRewrite: {
          '/n1/api': '/api'
        }
      },
      '/n2/api': {
        target: 'http://192.168.2.26:8888',
        pathRewrite: {
          '/n2/api': '/api'
        }
      },
      '/n3/api': {
        target: 'http://192.168.2.26:48080',
        pathRewrite: {
          '/n3/api': '/api'
        }
      },
      '/n4/api': {
        target: 'http://192.168.2.26:18080',
        pathRewrite: {
          '/n4/api': '/api'
        }
      },
      '/n5/api': {
        target: 'http://192.168.2.26:8888',
        pathRewrite: {
          '/n5/api': '/api'
        }
      },
      '/api/admin.v1.Lblet': {
        target: 'http://192.168.2.26:9001',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Virtual': {
        target: 'http://192.168.2.26:48080',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Mysql': {
        target: 'http://192.168.2.26:18080',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Mssql': {
        target: 'http://192.168.2.26:18080',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Event': {
        target: 'http://192.168.2.26:8888',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Workflow': {
        target: 'http://192.168.2.26:8888',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Oracle': {
        target: 'http://192.168.2.26:9001',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.DataGuard': {
        target: 'http://192.168.2.26:9001',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Storage': {
        target: 'http://192.168.2.26:1111',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Pool': {
        target: 'http://192.168.2.26:1111',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.UserLog': {
        target: 'http://192.168.221.157:8090',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.User': {
        target: 'http://192.168.221.157:8090',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Role': {
        target: 'http://192.168.221.157:8090',
        pathRewrite: {
          '': ''
        }
      },
      '/api/admin.v1.Resource': {
        target: 'http://192.168.221.157:8090',
        pathRewrite: {
          '': ''
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,

  lintOnSave: undefined,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/theme.less')]
    }
  }
}

module.exports = vueConfig
