import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint configuration — see 01_AGENTS.md § AI Generation Rules and
 * 07_CODING_STANDARDS.md. Enforces: strict TypeScript, React Hooks rules,
 * import ordering (see § Import Order: React → Third Party → MUI →
 * Components/Hooks/Services/Utils → CSS), and `no-console` (see § Logging
 * Rules: "console.log() Forbidden").
 */
export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'e2e', 'playwright.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    plugins: {
      'import-x': importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object'],
          pathGroups: [
            { pattern: '@mui/**', group: 'external', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'before' },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-unresolved': 'off',
      'import-x/no-duplicates': 'error',
    },
  },
]);
