class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.speed = 190;
    this.dirX = 0;
    this.dirY = 0;

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.entities.push(this);
    //this.scene.physics.add.existing(this);

    this.setOrigin(0.5, 0.5);

    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.play('idle', true);

    this.setDepth(9);
    /*this.body.setSize(16, 16);
    this.body.offset.x = 16;
    this.body.offset.y = 16;*/

    this.way = [];
    this.steps = [];

    //this.scene.physics.add.collider(this, this.scene.groundLayer);
  }

  FindWay(world, endX, endY) {
    for (let s of this.steps) {
      s.destroy();
    }

    this.way = [];
    this.steps = [];

    if (world[endX][endY] == 0) {

      

      let columns = world.length;
      let rows = world[0].length;

      let startX = Math.round(this.x / 16);
      let startY = Math.round(this.y / 16);

      startX = Math.max(0,startX);
      startY = Math.max(0,startY);

      startX = Math.min(startX, columns-1);
      startY = Math.min(startY, rows-1);

      //Inicialización del mundo con todas las células nuertas
      let cells = new Array(columns);

      //Rellena el array de arrays para hacer una matriz
      for (var i = 0; i < cells.length; i++) {
        cells[i] = new Array(rows);
      }

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          cells[i][j] = new Cell(world[i][j], i, j);
        }
      }

      //-1 pared
      //0 libre
      //1 actual
      //2 final
      //3
      //4 pared




      if (cells[startX][startY].state != 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (world[startX + i][startY + j] == 0) {
              startX = startX + i;
              startY = startY + j;
            }
          }
        }
      }

      cells[startX][startY].state = 1;
      cells[endX][endY].state = 2;
      let start = new Node(cells[startX][startY], null);


      start.ComputeFScore(endX, endY);

      let openList = [];
      openList.push(start);

      let current = openList[0];

      let count = 0;

      while (openList.length > 0 && count < 999999) {
        count++;
        current.cell.state = 4;

        let minF = Infinity;
        openList.forEach(n => {
          if (n.f < minF) {
            minF = n.f;
            current = n;
          }
        });

        current.cell.state = 1;

        let index = openList.indexOf(current);
        if (index > -1) {
          openList.splice(index, 1);
        }

        if (current.x == endX && current.y == endY) {
          while (current.parent) {
            let w = { x: current.x * 16 + 8, y: current.y * 16 - 8 };
            this.steps.push(this.scene.add.rectangle(w.x, w.y, 3, 3, 0xffffff).setDepth(10).setOrigin(0.5, 0.5));
            this.way.push(w);
            current = current.parent;
          }
          return;
        } else {
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {

              if (Math.abs(i + j) == 1) {//Not checking self i != 0 || j != 0 //Math.abs(i + j) == 1
                let currentX = current.x + i;
                let currentY = current.y + j;

                if (currentX >= 0 && currentX < columns && currentY >= 0 && currentY < rows) {//add "&& i!=j" to avoid diagonals
                  let neighbour = cells[currentX][currentY];

                  if (neighbour.state == 0 || neighbour.state == 2) {
                    neighbour.state = 3;

                    let newNode = new Node(neighbour, current);
                    let cost = neighbour.cost;

                    newNode.ComputeFScore(endX, endY, cost);
                    openList.push(newNode);
                  }
                  cells[current.x + i][current.y + j] = neighbour;
                }
              }
            }
          }
        }
      }
    }
    console.log(":(");
  }

  Update(time, delta) {
    if (this.way.length >= 1) {
      let idx = this.way.length - 1;
      let x = Math.abs(this.way[idx].x - this.x) > 4;
      let y = Math.abs(this.way[idx].y - this.y) > 4;

      if (x || y) {
        this.anims.play("walk", true);
        if (x) {
          let difX = this.way[idx].x - this.x;

          if (difX > 0) {
            this.dirX = 1;
            this.flipX = false;
          } else {
            this.dirX = -1;
            this.flipX = true;
          }
        } else { this.dirX = 0; }
        if (y) {
          let difY = this.way[idx].y - this.y;

          if (difY > 0) {
            this.dirY = 1;
          } else {
            this.dirY = -1;
          }
        } else { this.dirY = 0; }
      } else {
        this.way.pop()
        this.steps[idx].destroy();
        this.steps.pop();
      }

    } else {
      this.dirX = 0;
      this.dirY = 0;
      this.anims.play('idle', true);
    }

    this.x += delta / 10 * this.dirX;
    this.y += delta / 10 * this.dirY;
  }

  GetX() {
    return Math.floor(this.x / 16);
  }

  GetY() {
    return Math.floor(this.y / 16);
  }


}