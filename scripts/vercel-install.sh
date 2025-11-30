#!/bin/bash
set -e

export ENABLE_EXPERIMENTAL_COREPACK=1
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_DOWNLOAD_PATH=/tmp/puppeteer_cache

corepack enable
corepack prepare pnpm@8.15.0 --activate
pnpm install --frozen-lockfile
