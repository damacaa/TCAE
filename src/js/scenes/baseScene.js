class BaseScene extends Phaser.Scene {
    constructor() {
        super("game");
        this.player;
        this.fading;
        this.gamepad;
    }

    create() {
        ui.EnableGameUI();
        currentScene = this;
        this.entities = [];

        this.pause = false;
        this.inRoom = false;
        this.inCorridor = true;
        this.clothes = [];
        this.rooms = [];

        this.fail = false;

        this.camera = this.cameras.main;
        this.camera.setOrigin(0.5, 0.5);
        this.camera.setBackgroundColor('rgba(60,90,10, 1)');
        //this.camera.setRenderToTexture(customPipeline);//Activa el shader
        this.fading = false;
        this.camera.fadeIn(500);
        this.camera.once('camerafadeincomplete', () => {
            this.fading = false;
        });

        this.LoadTileMap();

        //Adding containers
        for (let index = 1; index <= 4; index++) {
            this.add.sprite(16 * index, 48, "container" + index).setDepth(1).setOrigin(0).setInteractive().on('pointerdown', function (pointer) {
                currentScene.gameManager.CheckTrash(index, currentScene.player);
            }, this);
        }

        this.player = new Player(this, 16, (this.map.height - 1) * 16);
        this.camera.startFollow(this.player);

        this.gameManager = new GameManager(this);

        this.input.on('pointerdown', function (pointer) {
            if (!this.pause) {
                let x = Math.floor(pointer.worldX / 16);
                let y = Math.floor(pointer.worldY / 16);

                this.ManageInput(x, y);
            }
        }, this);


    }

    LoadTileMap() {
        this.map = this.make.tilemap({ key: "hospital" });
        this.tiles = this.map.addTilesetImage('sprites', 'atlas_extruded', 16, 16, 1, 2);
        this.wallLayer = this.map.createLayer('Walls', this.tiles, 0, 0).setDepth(-1);
        this.itemLayer = this.map.createLayer('Items', this.tiles, 0, 0).setDepth(1);

        let columns = this.map.width;
        let rows = this.map.height;

        this.world = new Array(columns);//Stores the tiles the character can walk through
        this.items = new Array(columns);//Stores the item in every tile

        for (var i = 0; i < this.world.length; i++) {
            this.world[i] = new Array(rows);
            this.items[i] = new Array(rows);
        }

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let wTile = this.wallLayer.getTileAt(i, j);

                this.world[i][j] = 0;

                if (wTile && wTile.index != 1) {
                    this.world[i][j] = 4;
                }
            }
        }

        this.camera.setBounds(0, 0, this.map.width * 16, this.map.height * 16);
    }

    AdddItem(item, x, y, w, h) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);
        w = Math.floor(w / 16);
        h = Math.floor(h / 16);

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.world[i][j] = 4;
                this.items[i][j] = item;
            }
        }

        console.log(item);
    }

    AddItem(item, x, y, w, h) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);
        w = Math.floor(w / 16);
        h = Math.floor(h / 16);

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.world[i][j] = 4;
                this.items[i][j] = item;
            }
        }

        console.log(item);
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

        let item = this.items[x][y];
        if (item != null && this.player.GetX() == closestX && this.player.GetY() + 1 == closestY) {
            item.Interact();
        } else {
            this.player.FindWay(this.world, closestX, closestY);
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
                    this.player.washedHands = false;////////SARA HA ESCRITO AQUI
                    this.player.washedHandsAntiseptic = false;
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

    CrossPatientDoor(door) {
        let goingIn = !this.inRoom;
        if (!this.fading) {
            this.camera.fadeOut(500);
            this.fading = true;
            this.camera.once('camerafadeoutcomplete', () => {
                let dist = 5 * 16;

                if (goingIn) {
                    currentRoom = door.room;
                    this.player.y -= dist;
                    this.gameManager.CheckMistakesGoingIn(currentRoom.patient, this.player);//////////////////////////////////////
                } else {
                    this.player.y += dist;
                    this.player.RemoveAllClothes();
                    this.player.washedHands = false;////////////SARA HA ESCRITO AQUI
                    this.player.washedHandsAntiseptic = false;

                    if (this.player.carriesTrash && !this.player.firstBag) {
                        this.gameManager.AddMistake({ "mistake": "No has usado la primera bolsa", "val": 1 });
                    }
                    currentRoom = null;
                }

                this.camera.fadeIn(500);
                this.fading = false;
                this.inRoom = goingIn;

                this.CheckMistakes();
            });
        } else {
            console.log("Nope");
        }

        return true;
    }

    WashHands(antiseptic) {
        console.log("Washing hands");
        this.player.washedHands = true;////////////SARA HA ESCRITO AQUI
        if (antiseptic) {
            this.player.washedHandsAntiseptic = true;
        }
    }

    ShowClothes() {
        if (this.pause) { return; }
        this.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, 0xff6699).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(400, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
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
        this.close.destroy();
    }

    ShowSink() {
        if (this.pause) { return; }
        this.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, 0x5599ff).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.soap = this.add.rectangle(64, 135, 64, 64, 0xff6699).setDepth(10).setScrollFactor(0).setOrigin(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.WashHands();
        });

        this.close = this.add.sprite(400, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.HideSink();
        });
    }

    HideSink() {
        this.pause = false;
        this.soap.destroy();
        this.background.destroy();
        this.close.destroy();
    }

    ShowActions() {

        if (this.pause) { return; }

        this.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, 0x5599ff).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(400, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.HideActions();
        });

        this.buttons = [];

        let a = this.add.text(300, 160, "aaaaaaaa", {
            fontFamily: 'm3x6',
            fontSize: '32px',
            color: '#eeeeba',
            align: 'center'
        }).setDepth(10).setOrigin(.5, .5).setScrollFactor(0).setLineSpacing(4);

        a.setInteractive().on('pointerdown', function (event) {
            this.player.CarryTrash(currentRoom.patient, 1);
        }, this);

        this.buttons.push(a);
    }

    HideActions() {
        this.pause = false;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].destroy();
        }
        this.background.destroy();
        this.close.destroy();
    }

    BlockTiles(x, y, w, h) {
        x = Math.floor(x / 16);
        y = Math.floor(y / 16);
        w = Math.floor(w / 16);
        h = Math.floor(h / 16);
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.world[i][j] = 4;
            }
        }
    }

    EndGame() {
        this.pause = true;
        this.camera.once('camerafadeincomplete', () => {
            console.log("menu");
            this.fading = false;
            currentScene.LoadScene("mainMenu");
        });
    }

    NextDay() { }

    CheckMistakes() {
        let fail = false;

        for (let i = 0; i < this.gameManager.mistakes.length; i++) {
            let m = this.gameManager.mistakes[i];
            if (m["val"] > 0) {
                fail = true;
            }
            console.log(m["mistake"]);
        }

        if (fail) {
            this.EndGame();
        }
    }

    ShowPatient() {
        if (this.pause) { return; }

        this.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, 0x5599ff).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(400, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.HidePatient();
        });

        this.buttons.push(a);
    }

    HidePatient() {
        this.pause = false;
        this.background.destroy();
        this.close.destroy();
    }

    TryInteract(item) {
        if (Phaser.Math.Distance.BetweenPoints(this.player, item) > 50) {

            this.player.FindWay(this.world, 2, 23);

            return false;
        }

        item.Interact();
    }
}