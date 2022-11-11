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
        this.clothes = [];
        this.rooms = [];

        this.fail = false;
        this.actionsDone = 0;
        this.days = 1;
        ui.UpdateDay(this.days);

        this.camera = this.cameras.main;
        this.camera.setOrigin(0.5, 0.5);
        this.camera.setBackgroundColor('#faaf89');
        //this.camera.setRenderToTexture(customPipeline);//Activa el shader
        this.fading = false;
        this.camera.fadeIn(500);
        this.camera.once('camerafadeincomplete', () => {
            this.fading = false;
        });
        this.t = 0;

        this.pointer = this.input.activePointer;

        this.LoadTileMap();

        //Adding containers
        for (let index = 1; index <= 4; index++) {
            let container = this.AddItem(16 * (39 + index), 146, "container" + index);
            container.name = "Contenidor de tipus " + index;
            container.Interact = function () {
                currentScene.gameManager.CheckTrash(index, currentScene.player);
                ui.DisableTrashIcon();
                currentScene.CheckMistakes();
                if (currentScene.actionsDone == 4) {
                    currentScene.NextDay();
                }
            }
        }

        let sink = this.AddItem(16 * 4, 11 * 16, "sink");
        sink.name = "Llavar-se les mans";
        sink.Interact = function () {
            ui.ShowSink();
        }
        sink = this.AddItem(16 * 39, 13 + (11 * 25), "sink");
        sink.name = "Llavar-se les mans";
        sink.Interact = function () {
            ui.ShowSink();
        }

        this.player = new Player(this, 16, (this.map.height - 2) * 16);
        this.camera.startFollow(this.player);

        this.gameManager = new GameManager(this);

        this.input.on('pointerdown', function (pointer) {
            if (!this.pause) {
                let x = Math.floor(pointer.worldX / 16);
                let y = Math.floor(pointer.worldY / 16);

                this.ManageInput(x, y);
            }
        }, this);

        //this.EnableLighting();
        ui.ShowRoomManager();


        this.clickSound = this.sound.add('clickSound', {
            loop: false
        });
        //this.postFxPlugin = this.plugins.get('rexoutlinepipelineplugin');
    }

    Reset() {
        this.actionsDone = 0;

        this.player.x = 16;
        this.player.y = (this.map.height - 2) * 16;
        for (let i = 0; i < this.rooms.length; i++) {
            this.rooms[i].Destroy();
        }

        for (var i = 6; i < 38; i++) {
            for (var j = 0; j < 24; j++) {
                if (this.items[i][j]) {
                    this.items[i][j] = null;
                    this.world[i][j] = 0;
                }
            }
        }

        this.rooms = [];

        this.gameManager.Reset();
    }

    EnableLighting() {
        this.lights.enable();

        this.lights.setAmbientColor(0x808080);

        this.lights.addLight(300, 300, 100, 0xeeeeba, 1);

        for (let i = 0; i < this.children.list.length; i++) {

            this.children.list[i].setPipeline('Light2D');
        }
    }

    LoadTileMap() {
        this.map = this.make.tilemap({
            key: "hospital"
        });
        this.tiles = this.map.addTilesetImage('sprites', 'atlas_extruded', 16, 16, 1, 2);
        this.wallLayer = this.map.createLayer('Walls', this.tiles, 0, 0).setDepth(-1);
        this.itemLayer = this.map.createLayer('Items', this.tiles, 0, 0).setDepth(1);

        let columns = this.map.width;
        let rows = this.map.height;

        this.world = new Array(columns); //Stores the tiles the character can walk through
        this.items = new Array(columns); //Stores the item in every tile

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

    AddItem(x, y, sprite, isItem = true) {
        let item = this.add.sprite(x, y, sprite).setDepth(1).setOrigin(0);

        x = Math.floor(x / 16);
        y = Math.floor(y / 16);
        let w = Math.ceil(item.width / 16);
        let h = Math.ceil(item.height / 16);

        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.world[i][j] = 4;
                if (isItem)
                    this.items[i][j] = item;
            }
        }

        /*let hitbox = this.add.rectangle(x * 16, y * 16, w * 16, h * 16, 0xff0000).setDepth(1).setOrigin(0);
        hitbox.alpha = 0.2;*/

        return item;
    }

    update(time, delta) {
        /*this.t += delta / 10000;

        let r = Math.floor(this.t * 255 + (1 - this.t) * 0);
        let g = Math.floor(this.t * 51 + (1 - this.t) * 128);
        let b = Math.floor(this.t * 51 + (1 - this.t) * 255);

        this.camera.setBackgroundColor(`rgba(${r},${g},${b}, 1)`);
        if (this.t >= 1) {
            this.t = 0;
        }*/

        if (this.pause) return;

        this.entities.forEach(element => element.Update(time, delta));

        let x = Math.floor(this.pointer.worldX / 16);
        let y = Math.floor(this.pointer.worldY / 16);

        let item = this.items[x][y];
        if (item) {
            ui.ShowSelectedItem(item.name)
            //console.log(item);
        } else {
            ui.ShowSelectedItem(" ")
        }
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

        while (this.world[closestX][closestY] != 0) {
            closestY++;
        }

        let item = this.items[x][y];
        if (item != null)
            this.clickSound.play();

        this.player.FindWay(this.world, closestX, closestY, item);

        /*if (item == null) {
            this.player.FindWay(this.world, closestX, closestY, null);
        } else  (this.player.GetX() == closestX && this.player.GetY() + 1 == closestY) {
            this.player.FindWay(this.world, closestX, closestY, null);
        }*/

        /*if (item != null && ) {
            
        } else {

        }*/
    }

    CrossPatientDoor(door) {
        if (!this.fading) {
            this.camera.fadeOut(500);
            this.fading = true;
            this.camera.once('camerafadeoutcomplete', () => {
                let dist = 5 * 16;

                this.player.x = door.x + 24;
                if (door.goingIn) {
                    currentRoom = door.room;
                    this.player.y = door.y - 36;
                    if (door.checkDoor) {
                        this.gameManager.CheckMistakesGoingIn(currentRoom.patient, this.player);
                    }
                } else {
                    this.player.y = door.y + 56;
                    this.player.RemoveAllClothes();
                    this.player.washedHands = false;
                    this.player.washedHandsAntiseptic = false;

                    if (this.player.carriesTrash && !this.player.firstBag) {
                        this.gameManager.AddMistake({
                            "mistake": "No has usado la primera bolsa",
                            "val": 1
                        });
                    }
                    currentRoom = null;
                }
                door.goingIn = !door.goingIn;

                this.camera.fadeIn(500);
                this.fading = false;

                if (door.checkDoor) {
                    this.CheckMistakes();
                }
            });
        } else {
            console.log("Nope");
        }

        return true;
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
        if (this.fading) {
            this.camera.once('camerafadeincomplete', () => {
                this.ShowEnd();
                this.fading = false;
            });
        } else {
            ui.ShowEnd(this.gameManager.mistakes);
        }
        this.days = 1;
        ui.UpdateDay(this.days);
    }

    NextDay() {
        this.days += 1;
        console.log("Day: " + this.days);
        ui.UpdateDay(this.days);
        this.Reset();
        ui.ShowRoomManager();
        ui.ShowSelectedItem("");
    }

    CheckMistakes() {
        let fail = false;

        for (let i = 0; i < this.gameManager.mistakes.length; i++) {
            let m = this.gameManager.mistakes[i];
            if (m["val"] > 0) {
                fail = true;
            }
            //console.log(m["mistake"]);
        }

        if (fail || this.gameManager.mistakes.length > 10) {
            //console.log("Bye bye");
            this.EndGame();
        }
    }
}