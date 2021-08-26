const NO_PRESSURE = 0;
const POS_PRESSURE = 1;
const NEG_PRESSURE = 2;

class Room {
    constructor(scene, x, y, patientInfo) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.patient = new Patient(scene, this.x + 5, 114, patientInfo);

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
        this.bed = this.scene.AddItem(this.x, 96, "bed");
        this.bed.Interact = function () { ui.ShowActions(); }

        this.door = this.scene.AddItem(this.x + 64, 256, "door1");
        this.door.room = this;
        this.door.Interact = function () {
            this.room.scene.CrossPatientDoor(this)
        }

        this.paper = this.scene.AddItem(this.x + 96, 272, "paper");
        this.paper.room = this;
        this.paper.Interact = function () {
            ui.ShowPatientInfo(this.room.patient);
        }

        this.table = this.scene.AddItem(this.x, 288, "table");
        this.table.Interact = function () { ui.ShowClothes(); }

        this.trashOutside = this.scene.AddItem(this.x + 96, 288, "trash");
        this.trashOutside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.secondBag = true;
                console.log("Segunda bolsa");
            }
        }

        this.trashInside = this.scene.AddItem(this.x + 96, 216, "trash");
        this.trashInside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.firstBag = true;
                console.log("Primera bolsa");
            } else {
                console.log("No dus brossa");
            }
        }
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

