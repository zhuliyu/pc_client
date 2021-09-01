module.exports = {
  presets: [['@babel/preset-env',
    {
      // 'useBuiltIns': 'entry'
    }
  ]],
  plugins: [['component',
    {
      'libraryName': 'element-ui',
      'styleLibraryName': 'theme-chalk'
    },
    'syntax-dynamic-import'
  ]]
}
