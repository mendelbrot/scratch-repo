## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup

```
npx create-next-app@latest .
```

**links**

https://www.sandromaglione.com/techblog/create-nextjs-project-with-typescript-eslint-prettier-tailwindcss

https://nextjs.org/docs/basic-features/eslint

https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

next.js documentation on new routing with app folder
https://beta.nextjs.org/docs/routing/fundamentals
https://beta.nextjs.org/docs/rendering/server-and-client-components

**configure eslint and prittier**

```
npm install -D eslint-config-prettier
```

.vscode/settings.json

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "files.autoSave": "onFocusChange"
}
```

.eslintrc.json

```
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ]
}
```

.package.json

```
"prettier": {
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 72,
  "semi": false,
  "tabWidth": 2,
  "useTabs": false
}
```

**set up tailwind**

https://tailwindcss.com/docs/guides/nextjs

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

./styles/globals.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**fix absolute import**

./tsconfig.json

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@libraries/*": ["libraries/*"]
    },
```
