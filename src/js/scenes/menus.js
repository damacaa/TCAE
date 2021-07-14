
class BaseMenuScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
        currentScene = this;
        this.EnableFullScreen();
        this.loading = false;

        if (ui) { ui.EnableMenuUI(); }

        this.SetUp();
    }

    SetUp() { }

    update() {
    }

    LoadScene(key) {
        if (!this.loading) {
            this.loading = true;
            this.cameras.main.fadeOut(500);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.loading = false;
                this.scene.start(key);
            });
        }
    }

    EnableFullScreen() {

        var FKey = this.input.keyboard.addKey('F');

        FKey.on('down', function () {

            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            }
            else {
                this.scale.startFullscreen();
            }

        }, this);
    }
}

class MainMenu extends BaseMenuScene {
    constructor() {
        super('mainMenu');
    }

    SetUp() {
        this.scene.launch('ui');

        this.start = this.add.text(240, 135, "Jugar", {
            fontFamily: 'm3x6',
            fontSize: '32px',
            color: '#eeeeba',
            align: 'left'
        }).setDepth(10).setOrigin(.5).setScrollFactor(0).setLineSpacing(4);

        this.start.on('pointerdown', function (event) {

        }, this);

        this.input.on('pointerdown', function (pointer) {
            this.LoadScene("game");
        }, this);

        this.cameras.main.fadeIn(500);
        //this.scene.start("game");
    }
}