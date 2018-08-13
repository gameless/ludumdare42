import * as _ from 'lodash';

class Track {
  portion: number;

  constructor(
    readonly good: Phaser.Sound,
    readonly bad: Phaser.Sound,
    readonly same: boolean
  ) {
    this.portion = 0;
  }

  play(loop: boolean) {
    this.good.loop = loop;
    this.good.play();
    if (!this.same) {
      this.bad.loop = loop;
      this.bad.play();
    }
  }

  updateVolume(badness: number) {
    if (this.same) {
      this.good.volume = this.portion;
    } else {
      this.bad.volume = badness * this.portion;
      this.good.volume = this.portion - this.bad.volume;
    }
  }
}

function getTrack(game: Phaser.Game, key: string) {
  const goodKey = 'music_' + key;
  const badKey = goodKey + '_bitcrushed';
  const same = !game.cache.checkSoundKey(badKey);
  const good = game.sound.add(goodKey, 0);
  const bad = game.sound.add(badKey, 0);
  return new Track(good, same ? good : bad, same);
}

export class Music {
  readonly tracks: { [key: string]: Track };
  badness: number;

  constructor(readonly game: Phaser.Game, keys: string[]) {
    this.tracks = { };
    keys.forEach(key => this.tracks[key] = getTrack(game, key));
    this.badness = 0;
  }

  play(loop: boolean) {
    _.forOwn(this.tracks, track => track.play(loop));
  }

  updateVolumes() {
    _.forOwn(this.tracks, track => track.updateVolume(this.badness));
  }

  fadeTrack(duration: number, key: string) {
    _.forOwn(this.tracks, (track, trackKey) => {
      const tween = this.game.add.tween(track);
      tween.to({ portion: trackKey === key ? 1 : 0 }, duration);
      tween.onUpdateCallback(() => this.updateVolumes());
      tween.onComplete.add(() => this.updateVolumes());
      tween.start();
    });
  }

  fadeBadness(duration: number, badness: number) {
    const tween = this.game.add.tween(this);
    tween.to({ badness: badness }, duration);
    tween.onUpdateCallback(() => this.updateVolumes());
    tween.onComplete.add(() => this.updateVolumes());
    tween.start();
  }

  setTrack(key: string) {
    this.fadeTrack(1, key);
  }

  setBadness(badness: number) {
    this.fadeBadness(1, badness);
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
