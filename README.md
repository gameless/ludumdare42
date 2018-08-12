Ludum Dare 42
=============

Install
-------

Install the necessary `node_modules`:
```sh
npm install
```

Develop
-------

Start the watcher with continuous rebuild:
```sh
npm run start
```
This will launch an HTTP server at <http://localhost:3333/>.

You can also typecheck the code:
```sh
npm run test
```

Build
-----

First clone the `gh-pages` branch to `../ludumdare42-gh-pages`:
```sh
git clone -b gh-pages --single-branch https://github.com/gameless/ludumdare42.git ../ludumdare42-gh-pages
```
Then anytime you want to build, run `build.sh` from the root of this repository.
