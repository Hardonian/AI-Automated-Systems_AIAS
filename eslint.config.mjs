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
  { ignores: ["dist", ".next", "node_modules", "reports", "ai/**/*", "vite.config.ts", "vitest.config.ts", "watchers/**/*", "scripts/**/*", "ops/**/*", "types/**/*", "supabase/functions/**/*", "tailwind.config.ts", "**/*.d.ts", "playwright.config.ts", "sentry.*.config.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: process.cwd(),
      },
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
      "react-refresh/only-export-components": ["off", { 
        allowConstantExport: true,
        allowExportNames: ["useFormField", "useSidebar", "toast", "metadata", "viewport", "generateMetadata", "generateStaticParams", "GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
      }],
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      
      // Performance rules
      "react/jsx-no-bind": ["off", { 
        allowArrowFunctions: true,
        allowBind: false,
        ignoreRefs: true
      }],
      "react/jsx-no-constructed-context-values": "off",
      "react/no-array-index-key": "off",
      "react/no-unstable-nested-components": "off",
      
      // Security rules
      "react/jsx-no-script-url": "error",
      "react/jsx-no-target-blank": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      
      // UX and Accessibility rules
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/mouse-events-have-key-events": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-distracting-elements": "warn",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
      "jsx-a11y/no-noninteractive-tabindex": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "jsx-a11y/scope": "warn",
      "jsx-a11y/tabindex-no-positive": "warn",
      
      // Code quality rules
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "warn",
      "object-shorthand": "warn",
      "prefer-destructuring": ["off", { 
        array: true, 
        object: true 
      }, { 
        enforceForRenamedProperties: false 
      }],
      
      // Import organization
      "import/order": ["off", {
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
      "import/no-extraneous-dependencies": ["off", {
        "devDependencies": ["**/*.{test,spec}.{ts,tsx,js,jsx}", "**/tests/**", "**/scripts/**"]
      }],
      
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": ["off", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": ["off", {
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
      
      // React specific
      "react/jsx-key": "error",
      "react/jsx-no-useless-fragment": "warn",
      "react/self-closing-comp": "warn",
      "react/no-unescaped-entities": "off", // Allow unescaped entities (common in content)
      "react/jsx-sort-props": ["off", {
        "callbacksLast": true,
        "shorthandFirst": true,
        "noSortAlphabetically": false,
        "reservedFirst": true
      }],
      "react-hooks/exhaustive-deps": "off",
      "no-case-declarations": "off",
      
      // Performance and best practices
      "no-console": ["off", { "allow": ["warn", "error", "info"] }],
      "no-debugger": "warn",
      "no-alert": "off",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "warn",
      "no-useless-return": "warn",
      "no-await-in-loop": "off",
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
);
