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
    }
}

