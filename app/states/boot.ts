export default function(game: Phaser.Game) {
  return {
    create() {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(8, 8);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(game.canvas);

      game.camera.bounds = game.world.bounds;

      game.state.start('pot');
    }
  };
};
