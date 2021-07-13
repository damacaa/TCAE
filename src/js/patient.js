class Patient extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'pacientes');

        this.scene = scene;
        this.scene.add.existing(this);
        //this.scene.entities.push(this);

        this.setDepth(1).setOrigin(0).setFrame(Math.floor(Math.random() * 4));
        this.enfermedad = new Enfermedad();
    }
}

class Enfermedad {
    constructor() {
        this.nombre;
        this.sintomas = [];
    }
}