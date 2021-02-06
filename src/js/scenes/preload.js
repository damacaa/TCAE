class Preload extends Phaser.Scene {

    constructor() {
        super('preload');
    }

    preload() {


        //Personaje
        this.load.spritesheet('player',
            'resources/player/player.png', {
            frameWidth: 20,
            frameHeight: 32
        }
        );



        //Escenario
        //this.load.image('puerta', 'resources/img/Items/Arcos de Paso/Arco de Paso.png');
        this.load.image('atlas', 'resources/level/Tile_sheet_extruded.png');
        this.load.tilemapTiledJSON('hospital', 'resources/level/hospital.json');

        //Musica
        //this.load.audio("music", "resources/audio/music.ogg"); // Musica fondo


        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', function (value) {//progress //fileProgress //complete
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.scene.start('mainMenu');
    }
}
