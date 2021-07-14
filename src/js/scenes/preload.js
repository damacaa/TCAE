class Preload extends Phaser.Scene {

    constructor() {
        super('preload');
    }

    preload() {


        //Personaje
        this.load.spritesheet('player',
            'resources/player/player.png', {
            frameWidth: 32,
            frameHeight: 32
        }
        );

        this.load.spritesheet('pacientes',
            'resources/npc/pacientes.png', {
            frameWidth: 12,
            frameHeight: 16
        }
        );

        this.load.image('Bata', 'resources/items/Ropa/Bata.png');
        this.load.image('Calzas', 'resources/items/Ropa/Calzas.png');
        this.load.image('Gafas', 'resources/items/Ropa/Gafas.png');
        this.load.image('Gorro', 'resources/items/Ropa/Gorro.png');
        this.load.image('Guantes', 'resources/items/Ropa/Guantes.png');
        this.load.image('Mascarilla', 'resources/items/Ropa/Mascarilla.png');

        //Escenario
        this.load.image('door1', 'resources/items/Door1.png');
        this.load.image('bed', 'resources/items/Bed.png');
        this.load.image('table', 'resources/items/Table.png');

        this.load.image('atlas_extruded', 'resources/level/Tile_sheet_extruded.png');
        this.load.tilemapTiledJSON('hospital', 'resources/level/hospital.json');

        //UI
        this.load.image('opciones', 'resources/ui/Opciones.png');
        this.load.image('cerrar', 'resources/ui/Cerrar.png');

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
