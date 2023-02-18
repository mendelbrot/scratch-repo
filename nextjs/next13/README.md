**staring a new next app. and things to do every time**

```
npx create-next-app@latest --typescript --eslint --use-yarn .
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
yarn add --dev eslint-config-prettier
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

.prettierrc.json

```
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 72,
  "semi": false,
  "tabWidth": 2,
  "useTabs": false,
}
```

**set up tailwind**

https://tailwindcss.com/docs/guides/nextjs

```
yarn add --dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
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
