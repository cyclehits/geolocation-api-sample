module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier'],
  plugins: ['vue'],
  rules: {
    semi: ['error', 'always'],
    'no-console': 'off',
    'padded-blocks': 'off',
    'space-before-function-paren': 'off'
  }
};
