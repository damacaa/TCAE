class Room {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.patient = new Patient(scene, x + 5, y); 
    }
}

