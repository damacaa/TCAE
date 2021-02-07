class BaseScene extends Phaser.Scene {
    constructor() {
        super("game");
        this.player;
        this.entities = [];
        this.fading;
        this.gamepad;
    }


    create() {
        ui.EnableGameUI();
        currentScene = this;
        inGame = true;



        this.camera = this.cameras.main;
        this.camera.setOrigin(0.5, 0.5);
        this.camera.setBackgroundColor('rgba(60,90,10, 1)');

        this.camera.setRenderToTexture(customPipeline);//Activa el shader

        //Crea el escenario

        //this.physics.add.overlap(this.player, this.enemyProjectiles, this.ProjectileDamage, null, this);

        this.fading = false;
        this.camera.fadeIn(500);
        this.camera.once('camerafadeincomplete', () => {
            this.fading = false;
        });

        this.LoadTileMap();


        this.player = new Player(this, 16, (this.map.height - 1) * 16);
        this.camera.startFollow(this.player);


        this.input.on('pointerdown', function (pointer) {
            let x = Math.floor(pointer.worldX / 16);
            let y = Math.floor(pointer.worldY / 16);

            this.ManageInput(x, y);
        }, this);

        this.input.on('pointerup', function (pointer) {

        }, this);
    }

    LoadTileMap() {
        this.map = this.make.tilemap({ key: "hospital" });
        this.tiles = this.map.addTilesetImage('sprites', 'atlas', 16, 16, 1, 2);
        this.wallLayer = this.map.createStaticLayer('Walls', this.tiles, 0, 0).setDepth(-1);
        this.itemLayer = this.map.createStaticLayer('Items', this.tiles, 0, 0).setDepth(1);

        let columns = this.map.width;
        let rows = this.map.height;

        this.world = new Array(columns);

        for (var i = 0; i < this.world.length; i++) {
            this.world[i] = new Array(rows);
        }

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {

                let wTile = this.wallLayer.getTileAt(i, j);
                let iTile = this.itemLayer.getTileAt(i, j);

                this.world[i][j] = 0;

                if (wTile && wTile.index != 1) {
                    this.world[i][j] = 4;
                }

                if (iTile) {
                    this.world[i][j] = 4;
                    /*switch (iTile.index) {
                        case 3:
                            console.log("New door");
                            new Door(this, i * 16, j * 16);
                            break;

                        default:
                            break;
                    }*/
                }
            }
        }

        /*this.wallLayer.on('pointerdown', function (event) {

           // this.player.FindWay(this.map, pointer.worldX, pointer.worldY);
            console.log(event);
        }, this);*/



        //console.log(this.map);

        /*this.groundTiles = this.map.addTilesetImage('Tile_sheet', 'atlas');
        this.groundLayer = this.map.createStaticLayer('Suelo', this.groundTiles, 0, 0).setDepth(4);*/

        //Colisiones
        //this.groundLayer.setCollisionBetween(1, 34);

        //this.physics.add.collider(this.players, this.groundLayer);
        //this.physics.add.collider(this.enemies, this.groundLayer);

        this.camera.setBounds(0, 0, this.map.width * 16, this.map.height * 16);
    }

    update(time, delta) {
        this.entities.forEach(element => element.Update(time, delta));
    }

    LoadScene(key) {
        if (!this.fading) {
            //this.player.body.setVelocityX(0);

            this.fading = true;
            this.camera.fadeOut(500);
            this.entities = [];

            this.camera.once('camerafadeoutcomplete', () => {
                this.scene.start(key);
            });
        }
    }

    ManageInput(x, y) {
        let iTile = this.itemLayer.getTileAt(x, y);

        if (iTile) {
            let closestX = x;
            let closestY = y;

            if (y > this.player.GetY()) {
                while (this.world[closestX][closestY] != 0) {
                    closestY--;
                }
            } else {
                while (this.world[closestX][closestY] != 0) {
                    closestY++;
                }
            }

            if (this.player.GetX() == closestX && this.player.GetY() + 1 == closestY) {
                let idx = iTile.index - 1;
                switch (idx) {
                    case 2:
                    case 3:
                    case 12:
                    case 13:
                    case 22:
                    case 23:
                        //Door
                        this.CrossDoor(y > this.player.GetY());
                        break;
                    case 14:
                    case 15:
                    case 16:
                    case 24:
                    case 24:
                    case 26:
                        this.ShowClothes();
                        break;
                    case 20:
                    case 21:
                    case 30:
                    case 31:
                        this.WashHands();
                    default:

                        break;
                }
            } else {
                this.player.FindWay(this.world, closestX, closestY);
            }
        } else {
            this.player.FindWay(this.world, x, y);
        }
    }

    CrossDoor(goingIn) {
        if (!this.fading) {
            this.camera.fadeOut(500);
            this.fading = true;
            this.camera.once('camerafadeoutcomplete', () => {
                let dist = 5 * 16;
                if (goingIn) {
                    this.player.y += dist;
                } else {
                    this.player.y -= dist;
                }

                this.camera.fadeIn(500);
                this.fading = false;
            });
        }else{
            console.log("Nope");
        }
    }

    WashHands() {
        console.log("Washing hands");
    }

    ShowClothes() {
        console.log("Clothes");
    }
}