const NO_PRESSURE = 0;
const POS_PRESSURE = 1;
const NEG_PRESSURE = 2;

class Room {
    constructor(scene, x, y, patientInfo, id) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.items = [];

        this.patient = new Patient(scene, this.x + 5, 98, patientInfo);
        this.patient.room = this;
        this.items.push(this.patient);


        this.hasAnteroom = this.patient.illnessType <= 1;
        if (this.hasAnteroom) {
            this.SetUpRoom2();
        } else {
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
        this.bed = this.scene.AddItem(this.x, 80, "bed");
        this.bed.room = this;
        this.bed.Interact = function () {
            currentRoom.TakeCareOfPatient();
        }
        this.bed.name = "Pacient"
        this.items.push(this.bed);

        this.door = this.scene.AddItem(this.x + 64, 256, "door1");
        this.door.room = this;
        this.door.goingIn = true;
        this.door.checkDoor = true;
        this.door.Interact = function () {
            this.room.scene.CrossPatientDoor(this)
        }
        this.door.name = "Entrar a l'habitació"
        this.items.push(this.door);

        this.paper = this.scene.AddItem(this.x + 96, 272, "paper");
        this.paper.room = this;
        this.paper.Interact = function () {
            ui.ShowPatientInfo(this.room.patient);
        }
        this.paper.name = "Informació sobre el pacient"
        this.items.push(this.paper);

        this.table = this.scene.AddItem(this.x, 288, "table");
        this.table.Interact = function () {
            ui.ShowClothes();
        }
        this.table.name = "Vestir-se";
        this.items.push(this.table);

        this.trashOutside = this.scene.AddItem(this.x + 96, 288, "trash");
        this.trashOutside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.secondBag = true;
                console.log("Segunda bolsa");
            }
        }
        this.trashOutside.name = "Poal de fem";
        this.items.push(this.trashOutside);

        this.trashInside = this.scene.AddItem(this.x + 96, 216, "trash");
        this.trashInside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.firstBag = true;
                console.log("Primera bolsa");
            } else {
                console.log("No dus brossa");
            }
        }
        this.trashInside.name = "Poal de fem";
        this.items.push(this.trashInside);
    }

    SetUpRoom2() {
        this.bed = this.scene.AddItem(this.x, 80, "bed");
        this.bed.room = this;
        this.bed.Interact = function () {
            currentRoom.TakeCareOfPatient();
        }
        this.bed.name = "Pacient"
        this.items.push(this.bed);

        this.door = this.scene.AddItem(this.x + 64, 256, "door1");
        this.door.room = this;
        this.door.goingIn = true;
        this.door.checkDoor = false;
        this.door.Interact = function () {
            this.room.scene.CrossPatientDoor(this)
        }
        this.door.name = "Entrar a l'antesala"
        this.items.push(this.door);

        this.paper = this.scene.AddItem(this.x + 96, 272, "paper");
        this.paper.room = this;
        this.paper.Interact = function () {
            ui.ShowPatientInfo(this.room.patient);
        }
        this.paper.name = "Informació sobre el pacient"
        this.items.push(this.paper);

        for (let i = 0; i < 7; i++) {
            this.items.push(this.scene.AddItem(this.x + (16 * i), 144, "wall", false));
        }

        this.door = this.scene.AddItem(this.x + 64, 160, "door1");
        this.door.room = this;
        this.door.goingIn = true;
        this.door.checkDoor = true;
        this.door.Interact = function () {
            this.room.scene.CrossPatientDoor(this)
        }
        this.door.name = "Entrar a l'habitació"
        this.items.push(this.door);

        //Table
        this.table = this.scene.AddItem(this.x, 192, "table");
        this.table.Interact = function () {
            ui.ShowClothes();
        }
        this.table.name = "Vestir-se";
        this.items.push(this.table);

        //Trash
        this.trashOutside = this.scene.AddItem(this.x + 96, 192, "trash");
        this.trashOutside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.secondBag = true;
                console.log("Segunda bolsa");
            }
        }
        this.trashOutside.name = "Poal de fem";
        this.items.push(this.trashOutside);

        this.trashInside = this.scene.AddItem(this.x + 96, 120, "trash");
        this.trashInside.Interact = function () {
            if (currentScene.player.carriesTrash) {
                currentScene.player.firstBag = true;
                console.log("Primera bolsa");
            } else {
                console.log("No dus brossa");
            }
        }
        this.trashInside.name = "Poal de fem";
        this.items.push(this.trashInside);
    }

    ChangePressure() {
        this.pressure++;
        if (this.pressure > 2) {
            this.pressure = 0;
        }

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

    Destroy() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].destroy();
        }
    }

    TakeCareOfPatient(){
        //ui.ShowActions();
        currentScene.player.CarryTrash(currentRoom.patient.illnessType);
        currentScene.actionsDone++;
        this.patient.takenCareOf = true;
    }
}