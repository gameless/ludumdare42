Plant's Conquest
================

Experience the life of a planet that has a plant on it. This plant is smol.
However, it has massive ambition. The problem is, that ambition causes it to
destroy everything that one could hold dear on our wonderful planet.

In our game, you play as a plant that emits a toxic substance that kills it and
things around it. It needs to expand in order to escape from this substance. The
goal is thus to escape into progressively larger levels.

(Apologies for the low amount of content and feeling of unfinishedness; this is
our first Ludum Dare and we sort of bit off more than we could chew with the
specific type of game we tried to make.)

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
