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

        this.load.image('BataB', 'resources/items/Ropa/BataBig.png');
        this.load.image('CalzasB', 'resources/items/Ropa/CalzasBig.png');
        this.load.image('GafasB', 'resources/items/Ropa/GafasBig.png');
        this.load.image('GorroB', 'resources/items/Ropa/GorroBig.png');
        this.load.image('GuantesB', 'resources/items/Ropa/GuantesBig.png');
        this.load.image('MascarillaB', 'resources/items/Ropa/MascarillaBig.png');

        //Escenario
        this.load.image('door1', 'resources/items/Door1.png');
        this.load.image('bed', 'resources/items/Bed.png');
        this.load.image('table', 'resources/items/Table.png');
        this.load.image('tableB', 'resources/items/TableBig.png');
        this.load.image('trash', 'resources/items/Trash.png');
        this.load.image('paper', 'resources/items/Paper.png');
        this.load.image('sink', 'resources/items/Sink.png');
        this.load.image('sinkB', 'resources/items/SinkBig.png');
        this.load.image('soap', 'resources/items/Jabon.png');
        this.load.image('soapA', 'resources/items/JabonAntiseptico.png');

        this.load.image('container1', 'resources/items/Container1.png');
        this.load.image('container2', 'resources/items/Container2.png');
        this.load.image('container3', 'resources/items/Container3.png');
        this.load.image('container4', 'resources/items/Container4.png');

        this.load.image('atlas_extruded', 'resources/level/Tile_sheet_extruded.png');
        this.load.tilemapTiledJSON('hospital', 'resources/level/hospital.json');

        //UI
        this.load.image('options', 'resources/ui/Opciones.png');
        this.load.image('close', 'resources/ui/Cerrar.png');

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
