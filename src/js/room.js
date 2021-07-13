class Room {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.patient = new Patient(scene, x + 5, 100);
        this.door = scene.add.rectangle(x + 64, 256, 32, 48, 0xff0000).setDepth(1).setOrigin(0).setInteractive();
        this.door.on('pointerdown', function (event) {
            if (scene.CrossPatientDoor()) {
                currentRoom = this;
            }
        }, this);

        this.paper = scene.add.rectangle(x + 104, 268, 12, 16, 0xffffff).setDepth(1).setOrigin(0).setInteractive();
        this.paper.on('pointerdown', function (event) {
            console.log(this.patient.illness);
        }, this);

        this.table = scene.add.rectangle(x, 288, 48, 32, 0x33FFA2).setDepth(1).setOrigin(0).setInteractive();
        this.table.on('pointerdown', function (event) {
            currentScene.ShowClothes();
        }, this);

        this.trashOutside = scene.add.rectangle(x + 102, 288, 16, 32, 0x5f5f6f).setDepth(1).setOrigin(0).setInteractive();
    }
}

