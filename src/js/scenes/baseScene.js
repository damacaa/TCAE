class BaseScene extends Phaser.Scene {
    constructor() {
        super("game");
        this.player;
        this.entities = [];
        this.fading;
        this.gamepad;

        this.pause = false;
        this.inRoom = false;
        this.inCorridor = true;
        this.clothes = [];
        this.rooms = [];
    }


    create() {
        ui.EnableGameUI();
        currentScene = this;

        this.camera = this.cameras.main;
        this.camera.setOrigin(0.5, 0.5);
        this.camera.setBackgroundColor('rgba(60,90,10, 1)');
        this.camera.setRenderToTexture(customPipeline);//Activa el shader
        this.fading = false;
        this.camera.fadeIn(500);
        this.camera.once('camerafadeincomplete', () => {
            this.fading = false;
        });

        this.LoadTileMap();

        this.player = new Player(this, 16, (this.map.height - 1) * 16);
        this.camera.startFollow(this.player);

        this.gameController = new GameController();

        this.input.on('pointerdown', function (pointer) {
            if (!this.pause) {
                let x = Math.floor(pointer.worldX / 16);
                let y = Math.floor(pointer.worldY / 16);

                this.ManageInput(x, y);
            }
        }, this);

        for (let i = 0; i < 4; i++) {
            this.rooms.push(new Room(this, 112 + (128 * i), 0));
        }
    }

    LoadTileMap() {
        this.map = this.make.tilemap({ key: "hospital" });
        this.tiles = this.map.addTilesetImage('sprites', 'atlas_extruded', 16, 16, 1, 2);
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
                }
            }
        }

        this.camera.setBounds(0, 0, this.map.width * 16, this.map.height * 16);
    }

    update(time, delta) {
        this.entities.forEach(element => element.Update(time, delta));
    }

    LoadScene(key) {
        if (!this.fading) {
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
                    case 3:
                    case 13:
                    case 23:
                        //Door
                        //this.CrossDoor(y < this.player.GetY());
                        this.CrossPatientDoor();
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
                        break;
                    case 66:
                        this.player.ThrowTrash(idx);
                        break;
                    case 81:
                    case 91:
                    case 101:
                        //Door
                        this.CrossDoor();
                        break;
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

    CrossDoor() {
        let goingIn = this.inCorridor;

        if (!this.fading) {
            this.camera.fadeOut(500);
            this.fading = true;
            this.camera.once('camerafadeoutcomplete', () => {
                let dist = 5 * 16;
                if (goingIn) {
                    this.player.y -= dist;
                } else {
                    this.player.y += dist;
                    this.player.washedHands=false;////////SARA HA ESCRITO AQUI
                }
                this.camera.fadeIn(500);
                this.fading = false;
                this.inCorridor = !goingIn;
            });
        } else {
            console.log("Nope");
        }

        return true;
    }

    CrossPatientDoor() {
        let goingIn = !this.inRoom;

        if (!this.fading) {
            this.camera.fadeOut(500);
            this.fading = true;
            this.camera.once('camerafadeoutcomplete', () => {
                let dist = 5 * 16;
                if (goingIn) {
                    this.player.y -= dist;
                    let mistakes = this.gameController.CheckMistakes(currentRoom.patient, this.player);//////////////////////////////////////
                    console.log(mistakes);
                    for (let i = 0; i < mistakes.length; i++) {
                        let m = mistakes[i];
                        if (m["val"] > 0) {
                            console.log("Has perdido");
                        }
                    }

                } else {
                    this.player.y += dist;
                    if (this.player.Wears(ID_MASCARILLA)) {
                        this.player.CarryTrash();
                        this.player.RemoveAllClothes();
                    }
                    this.player.washedHands=false;////////////SARA HA ESCRITO AQUI
                }
                this.camera.fadeIn(500);
                this.fading = false;
                this.inRoom = goingIn;
            });
        } else {
            console.log("Nope");
        }

        return true;
    }

    WashHands() {
        console.log("Washing hands");
        this.player.washedHands=true;////////////SARA HA ESCRITO AQUI
    }

    ShowClothes() {
        this.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, 0xff6699).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.cerrar = this.add.sprite(400, 62, 'cerrar').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.HideClothes();
        });

        let guantes = this.add.sprite(100, 100, 'Guantes').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_GUANTES))
                guantes.destroy();
        });
        this.clothes.push(guantes);

        let gorro = this.add.sprite(140, 100, 'Gorro').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_GORRO))
                gorro.destroy();
        });
        this.clothes.push(gorro);

        let mascarilla = this.add.sprite(200, 100, 'Mascarilla').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_MASCARILLA))
                mascarilla.destroy();
        });
        this.clothes.push(mascarilla);

        let gafas = this.add.sprite(300, 100, 'Gafas').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_GAFAS))
                gafas.destroy();
        });
        this.clothes.push(gafas);

        let calzas = this.add.sprite(140, 200, 'Calzas').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_CALZAS))
                calzas.destroy();
        });
        this.clothes.push(calzas);

        let bata = this.add.sprite(300, 200, 'Bata').setDepth(11).setScrollFactor(0).setScale(8).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(ID_BATA))
                bata.destroy();
        });
        this.clothes.push(bata);
    }

    HideClothes() {

        this.pause = false;
        for (let i = 0; i < this.clothes.length; i++) {
            this.clothes[i].destroy();
        }

        this.background.destroy();
        this.cerrar.destroy();
    }
}