const NO_PRESSURE = 0;
const POS_PRESSURE = 1;
const NEG_PRESSURE = 2;

class Room {
    constructor(scene, x, y, patientInfo) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.patient = new Patient(scene, this.x + 5, 114, patientInfo);
        this.patient.setInteractive().on('pointerdown', function (event) {
            currentScene.ShowActions();
        }, this);

        this.hasAnteroom = this.patient.illnessType <= 1;
        if (this.hasAnteroom) { this.SetUpRoom2(); } else {
            this.SetUpRoom1();
        }

        switch (patientInfo.illnessType) {
            case 0:
            case 2:
                this.pressure = NEG_PRESSURE;
                break;
            case 1:
                this.pressure = POS_PRESSURE;
                break;
            default:
                this.pressure = NO_PRESSURE;
                break;
        }
    }

    SetUpRoom1() {
        this.bed = this.scene.add.sprite(this.x, 96, "bed").setDepth(1).setOrigin(0).setInteractive();
        this.bed.Interact = function () { currentScene.ShowActions(); }
        this.scene.AddItem(this.bed, this.x, 96 + 16, 48, 32);

        this.door = this.scene.add.sprite(this.x + 64, 256, "door1").setDepth(1).setOrigin(0).setInteractive();
        this.door.room = this;
        this.door.Interact = function () {
            this.room.scene.CrossPatientDoor(this)
        }
        this.scene.AddItem(this.door, this.x + 64, 256, 32, 48);

        this.paper = this.scene.add.rectangle(this.x + 104, 268, 12, 16, 0xffffff).setDepth(1).setOrigin(0).setInteractive();

        this.button = this.scene.add.rectangle(this.x + 40, 268, 16, 16, 0xdd0000).setDepth(1).setOrigin(0).setInteractive();


        this.table = this.scene.add.sprite(this.x, 288, "table").setDepth(1).setOrigin(0).setInteractive();
        this.table.room = this;
        this.table.Interact = function () { currentScene.ShowClothes(); }
        this.scene.AddItem(this.table, this.x, 304, 48, 16);

        this.trashOutside = this.scene.add.sprite(this.x + 102, 288, "trash").setDepth(1).setOrigin(0).setInteractive();
        this.trashOutside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.secondBag = true;
                console.log("Segunda bolsa");
            }
        }
        this.scene.AddItem(this.trashOutside, this.x + 102, 288, 32, 32);

        this.trashInside = this.scene.add.sprite(this.x + 94, 200, "trash").setDepth(1).setOrigin(0).setInteractive();
        this.trashInside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.firstBag = true;
                console.log("Primera bolsa");
            }
        }
        this.scene.AddItem(this.trashInside, this.x + 94, 200, 32, 32);
    }

    SetUpRoom2() { this.SetUpRoom1(); }

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

