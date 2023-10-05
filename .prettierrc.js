"use strict"

module.exports = {
  plugins: [
    // require('prettier-plugin-tailwindcss'),
    '@trivago/prettier-plugin-sort-imports'
  ],
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^components/(.*)$',
    '^(utils|hooks|contexts)/(.*)$',
    '^types/(.*)$',
    '^(config|styles)/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
