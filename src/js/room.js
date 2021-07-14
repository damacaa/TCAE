const NO_PRESSURE = 0;
const POS_PRESSURE = 1;
const NEG_PRESSURE = 2;
class Room {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.pressure = NO_PRESSURE;

        this.SetUpRoom1();
    }

    SetUpRoom1() {

        this.patient = new Patient(this.scene, this.x + 5, 114);
        this.patient.setInteractive().on('pointerdown', function (event) {
            currentScene.ShowActions();
        }, this);

        this.bed = this.scene.add.sprite(this.x, 96, "bed").setDepth(1).setOrigin(0).setInteractive();
        this.scene.BlockTiles(this.x, 96 + 16, 48, 32);

        //this.door = this.scene.add.rectangle(this.x + 64, 256, 32, 48, 0xff0000).setDepth(1).setOrigin(0).setInteractive();

        this.door = this.scene.add.sprite(this.x + 64, 256, "door1").setDepth(1).setOrigin(0).setInteractive();

        this.door.on('pointerdown', function (event) {
            if (this.scene.CrossPatientDoor()) {
                currentRoom = this;
            }
        }, this);

        this.paper = this.scene.add.rectangle(this.x + 104, 268, 12, 16, 0xffffff).setDepth(1).setOrigin(0).setInteractive();
        this.paper.on('pointerdown', function (event) {
            console.log(this.patient.illness);
        }, this);

        this.button = this.scene.add.rectangle(this.x + 40, 268, 16, 16, 0xdd0000).setDepth(1).setOrigin(0).setInteractive();
        this.button.on('pointerdown', function (event) {
            this.ChangePressure();
        }, this);


        this.table = this.scene.add.sprite(this.x, 288, "table").setDepth(1).setOrigin(0).setInteractive();
        this.scene.BlockTiles(this.x, 304, 48, 16);
        this.table.on('pointerdown', function (event) {
            currentScene.ShowClothes();
        }, this);

        this.trashOutside = this.scene.add.rectangle(this.x + 102, 288, 16, 32, 0x5f5f6f).setDepth(1).setOrigin(0).setInteractive();
        this.trashOutside.on('pointerdown', function (event) {
            this.scene.player.secondBag = true;
            console.log("Segunda bolsa");
        }, this);

        this.trashInside = this.scene.add.rectangle(this.x + 94, 200, 16, 32, 0x5f5f6f).setDepth(1).setOrigin(0).setInteractive();
        this.trashInside.on('pointerdown', function (event) {
            this.scene.player.firstBag = true;
            console.log("Primera bolsa");
        }, this);
    }

    SetUpRoom2() { }

    ChangePressure() {
        this.pressure++;
        if (this.pressure > 2) { this.pressure = 0; }

        switch (this.pressure) {
            case NO_PRESSURE:
                console.log("No hay presión");
                break;
            case POS_PRESSURE:
                console.log("Presión positiva");
                break;
            case NEG_PRESSURE:
                console.log("Presión negativa");
                break;

            default:
                break;
        }
    }
}

