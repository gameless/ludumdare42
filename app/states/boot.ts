export default function(game: Phaser.Game) {
  return {
    create() {
      game.state.start('pot');
    }
  };
};
