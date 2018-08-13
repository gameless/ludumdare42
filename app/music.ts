import * as _ from 'lodash';

class Track {
  constructor(
    readonly good: Phaser.Sound,
    readonly bad: Phaser.Sound,
    readonly same: boolean
  ) { }

  play() {
    this.good.play();
    if (!this.same) {
      this.bad.play();
    }
  }
}

function addLoop(game: Phaser.Game, key: string) {
  return game.sound.add(key, 0, true);
}

function getTrack(game: Phaser.Game, key: string) {
  const goodKey = 'music_' + key;
  const badKey = goodKey + '_bitcrushed';
  const same = !game.cache.checkSoundKey(badKey);
  const good = addLoop(game, goodKey);
  const bad = addLoop(game, badKey);
  return new Track(good, same ? good : bad, same);
}

export class Music {
  readonly tracks: { [key: string]: Track };

  constructor(game: Phaser.Game, keys: string[]) {
    this.tracks = { };
    keys.forEach(key => this.tracks[key] = getTrack(game, key));
  }

  play() {
    _.forOwn(this.tracks, track => track.play());
  }
};

export class MusicalState extends Phaser.State {
  // @ts-ignore
  music: Music;

  init(music: Music) {
    this.music = music;
  }
}

export function startState(game: Phaser.Game, state: string, music: Music) {
  game.state.start(state, true, false, music);
}
