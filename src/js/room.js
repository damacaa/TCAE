class Room {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;


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

        this.table = this.scene.add.sprite(this.x, 288, "table").setDepth(1).setOrigin(0).setInteractive();
        this.scene.BlockTiles(this.x, 304, 48, 16);
        this.table.on('pointerdown', function (event) {
            currentScene.ShowClothes();
        }, this);

        this.trashOutside = this.scene.add.rectangle(this.x + 102, 288, 16, 32, 0x5f5f6f).setDepth(1).setOrigin(0).setInteractive();
    }

    SetUpRoom2() { }
}

