## Setup

**One-liner:** Create private repo. Clone it. Install deps. Open VS Code.

```bash
PROJECT_NAME='boil-node' # Repo will be named "boil-node" unless you change this.
gh repo create --private --clone --template Christopher-Hayes/boil-node "$PROJECT_NAME" && cd "$PROJECT_NAME" && npm i && code .
```

*For other IDEs replace `code .`*

## Start

Run your code once.

```bash
npm run start
```

## Dev

Your code will rerun when files change.

```bash
npm run dev
```

# boil-node

A template repo for simple Node.js projects.

Primarly focused on prototyping with Node.JS where the tools should not get in the way.

## Goals with this template

I use Node.JS a lot for small internal tools. Typescript is a must-have when working with data, and it's hassle remembering how to set it up each time to use modern JS features. Popular GitHub Node.JS templates try to be too helpful, and slow down dev.

**This template has..**

- `YES` Supports modern JS features
- `YES` Typescript should just work
- `YES` JS is allowed too, typescript is not forced

**This template does not include..**

- `NO` Aggressive linting
- `NO` Messing with tsc build config
- `NO` Testing, just building
- `NO` Git hooks, vscode settings, or other annoying defaults
  - **Update:** There is a git hook to create `.env` on clone. But, other than that, no hooks.
