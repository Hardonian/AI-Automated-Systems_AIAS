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
  { 
    ignores: [
      "dist", 
      ".next", 
      "node_modules", 
      "reports", 
      "ai/**/*", 
      "vite.config.ts", 
      "watchers/**/*", 
      "scripts/**/*", 
      "ops/**/*", 
      "types/**/*",
      "src/**/*",
      "tests/**/*",
      "supabase/functions/**/*",
      "packages/**/*",
      "apps/**/*"
    ] 
  },
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
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      
      // Performance rules
      "react/jsx-no-bind": "off",
      "react/jsx-no-constructed-context-values": "off",
      "react/no-array-index-key": "off",
      "react/no-unstable-nested-components": "off",
      
      "react/jsx-no-target-blank": "off",
      "react/jsx-no-script-url": "off",
      "@typescript-eslint/no-explicit-any": "off",
      
      // UX and Accessibility rules
      "jsx-a11y/role-has-required-aria-props": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/mouse-events-have-key-events": "off",
      "jsx-a11y/anchor-is-valid": "off",
      
      // Code quality rules
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": "warn",
      "object-shorthand": "warn",
      "prefer-destructuring": "off",
      
      // Import organization
      "import/order": "off",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "import/no-extraneous-dependencies": "off",
      
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off", 
      "@typescript-eslint/prefer-optional-chain": "off", 
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-duplicate-imports": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "no-empty": "off",
      "no-alert": "off",
      
      // React specific
      "react/jsx-key": "warn",
      "react/jsx-no-useless-fragment": "off",
      "react/self-closing-comp": "off",
      "react/no-unescaped-entities": "off",
      "react/jsx-sort-props": "off",
      
      // Performance and best practices
      "no-console": "off",
      "no-debugger": "warn",
      "no-alert": "warn",
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
      "prefer-promise-reject-errors": "warn",
      "radix": "off",
      "wrap-iife": ["error", "any"],
      "yoda": "error"
    },
  },
);
