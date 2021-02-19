const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

// const plugins = []
if (IS_PROD) {
  // plugins.push('transform-remove-console')
}

module.exports = process.env.NODE_ENV === 'test' ? {
  presets: [
    // XXX: (node 环境)[https://github.com/facebook/jest/issues/7579]
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@vue/babel-preset-jsx']
  ],
  plugins: [
    '@babel/plugin-syntax-jsx'
  ]
} : {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry',
        'corejs': 3
      }
    ]
  ],
  plugins: [
    ['import', { 'libraryName': 'ant-design-vue', 'libraryDirectory': 'es', 'style': true }, 'antd'],
    ['import', { 'libraryName': 'lodash', 'libraryDirectory': '', 'camel2DashComponentName': false, 'camel2UnderlineComponentName': false }, 'lodash']
  ]
}
