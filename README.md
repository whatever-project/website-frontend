[![Frontend CI](https://github.com/whatever-project/website-frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/whatever-project/website-frontend/actions/workflows/frontend-ci.yml)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project structure

See [docs/STRUCTURE.md](docs/STRUCTURE.md) for the folder layout, routes, i18n setup and known gaps.

## Git conventions

Git hooks (Husky) are installed automatically by `npm install`.

**Branch names** must start with `dev/` or `design/`, followed by a name and optionally the page, e.g. `dev/sho/landing-page` or `design/landing-page`. `main` is exempt. This is checked on commit and push; fix a wrong name with `git branch -m dev/<name>/<page>`.

**Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org): `type: lower-case subject`, up to 100 characters. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`. Rules live in `commitlint.config.js`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
