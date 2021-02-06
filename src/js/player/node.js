function Cell(state, x, y) {

    //La posición de la célula
    this.x = x;
    this.y = y;

    this.state = 0;
    if (state != 0) { this.state = -1; }

    this.cost = 100;

    //currentScene.add.rectangle(this.x * 32, this.y * 32, 32, 32, 0xffffff).setDepth(10).setOrigin(0.5, 0.5).setDepth(0);

    //-1 wall
    //0 empty
    //1 player
    //2 goal
    //3 open
    //4 closed
}

function Node(cell, parent) {

    //La posición de la célula
    this.x = cell.x;
    this.y = cell.y;

    this.cell = cell;

    this.parent = parent;
    this.h;
    this.f;
    this.g = 0;

    this.id = this.x + " " + this.y;

    

    this.ComputeHScore = function (targetX, targetY) {
        this.h = Math.abs(targetX - this.x) + Math.abs(targetY - this.y);
    }

    this.ComputeFScore = function (targetX, targetY, cost) {
        this.ComputeHScore(targetX, targetY);

        if (this.parent) { this.g = this.parent.g + cost; }

        this.f = this.g + this.h;
    }

}