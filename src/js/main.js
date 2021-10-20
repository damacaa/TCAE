var config;
var game;

window.onload = function () {
    config = {
        type: Phaser.WEBGL,
        pixelArt: true,
        roundPixels: false,
        scale: {
            mode: Phaser.Scale.FIT,// Phaser.Scale.FIT || Phaser.Scale.RESIZE
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 480,
            height: 270,
        }, fps: {
            target: 30,
            forceSetTimeOut: true
        },
        scene: [Preload, MainMenu, BaseScene, UI]
    }

    loadFont("m3x6", "resources/fonts/m3x6.ttf");
    loadFont("BetterPixelsAcce", "resources/fonts/BetterPixelsAcce.ttf");

    game = new Phaser.Game(config);
}

//https://stackoverflow.com/questions/51217147/how-to-use-a-local-font-in-phaser-3
function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

