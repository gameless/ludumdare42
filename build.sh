#!/bin/sh
rm -r public
npm run build
cd ..
rm -r ludumdare42-gh-pages/*
cp -r ludumdare42/public/. ludumdare42-gh-pages
cd ludumdare42-gh-pages
git add .
git commit -m 'Build'
git push
