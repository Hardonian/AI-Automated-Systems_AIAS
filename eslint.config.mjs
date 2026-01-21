import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["bench/**", "dist", ".next", "next-env.d.ts", "node_modules", "reports", "ai/**/*", "playwright.config.ts", "sentry.client.config.ts", "sentry.edge.config.ts", "sentry.server.config.ts", "vite.config.ts", "vitest.config.ts", "watchers/**/*", "scripts/**/*", "ops/**/*", "types/**/*", "apps/web/**", "supabase/functions/**/*", "tailwind.config.ts", "src/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      "import": importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { 
        allowConstantExport: true,
        allowExportNames: ["useFormField", "useSidebar", "toast"]
      }],
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      
      // Performance rules
      "react/jsx-no-bind": ["warn", { 
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true
      }],
      "react/jsx-no-constructed-context-values": "warn",
      "react/no-array-index-key": "warn",
      "react/no-unstable-nested-components": "warn",
      
      // Security rules
      "react/jsx-no-script-url": "error",
      "react/jsx-no-target-blank": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // UX and Accessibility rules
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/mouse-events-have-key-events": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-distracting-elements": "warn",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/scope": "warn",
      "jsx-a11y/tabindex-no-positive": "warn",
      
      // Code quality rules
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "warn",
      "object-shorthand": "warn",
      "prefer-destructuring": ["warn", { 
        array: true, 
        object: true 
      }, { 
        enforceForRenamedProperties: false 
      }],
      
      // Import organization
      "import/order": ["warn", {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "import/no-extraneous-dependencies": "off",
      
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["warn", {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }],
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Requires parserServices
      "@typescript-eslint/prefer-optional-chain": "off", // Requires parserServices
      "@typescript-eslint/no-unnecessary-condition": "off", // Requires parserServices
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-require-imports": "off",
      
      // React specific
      "react/jsx-key": "error",
      "react/jsx-no-useless-fragment": "warn",
      "react/self-closing-comp": "warn",
      "react/no-unescaped-entities": "warn", // Allow unescaped entities (common in content)
      "react/jsx-sort-props": ["warn", {
        "callbacksLast": true,
        "shorthandFirst": true,
        "noSortAlphabetically": false,
        "reservedFirst": true
      }],
      
      // Performance and best practices
      "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
      "no-debugger": "warn",
      "no-alert": "warn",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "warn",
      "no-useless-return": "warn",
      "no-await-in-loop": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-labels": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-escape": "error",
      "no-void": ["error", { "allowAsStatement": true }],
      "prefer-promise-reject-errors": "error",
      "radix": "off",
      "wrap-iife": ["error", "any"],
      "yoda": "error"
    },
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "import/order": "off",
      "react/jsx-no-bind": "off",
      "react/no-unescaped-entities": "off",
      "react-refresh/only-export-components": "off",
      "react/jsx-sort-props": "off",
      "react/no-array-index-key": "off",
      "no-case-declarations": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "import/order": "off",
      "no-await-in-loop": "off",
      "prefer-destructuring": "off",
      "radix": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "curly": "off",
      "import/order": "off",
      "import/no-duplicates": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "off",
      "jsx-a11y/no-redundant-roles": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "no-alert": "off",
      "no-duplicate-imports": "off",
      "prefer-destructuring": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-no-bind": "off",
      "react/jsx-no-constructed-context-values": "off",
      "react/jsx-no-useless-fragment": "off",
      "react/jsx-sort-props": "off",
      "react/self-closing-comp": "off",
      "react/no-unescaped-entities": "off",
      "react-refresh/only-export-components": "off",
      "react/no-array-index-key": "off",
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["lib/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "curly": "off",
      "import/order": "off",
      "import/no-duplicates": "off",
      "no-eval": "off",
      "no-async-promise-executor": "off",
      "no-await-in-loop": "off",
      "no-case-declarations": "off",
      "no-console": "off",
      "no-control-regex": "off",
      "no-duplicate-imports": "off",
      "no-useless-concat": "off",
      "no-script-url": "off",
      "no-useless-catch": "off",
      "no-useless-escape": "off",
      "object-shorthand": "off",
      "prefer-const": "off",
      "prefer-destructuring": "off",
      "react-hooks/rules-of-hooks": "off",
      "react/jsx-no-bind": "off",
      "react/jsx-no-useless-fragment": "off",
      "react/jsx-sort-props": "off",
      "eqeqeq": "off",
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["middleware/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["guardian/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["hooks/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
  {
    files: ["instrumentation.ts"],
    rules: {
      "no-console": "off",
      "no-eval": "off",
    },
  },
  {
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-extraneous-dependencies": "off",
      "no-await-in-loop": "off",
      "radix": "off",
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
);
