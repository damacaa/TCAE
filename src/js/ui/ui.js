let ui;
let textColor = '#ffffff';
let darkTextColor = '#222244';
let backgroundColor = 0x4abedf;
let darkBackgroundColor = 0x556181;
let white = 0xfffff0;

class UI extends BaseMenuScene {
    constructor() {
        super('ui');

        this.playing = false;
        this.pause = false;

        this.mobile = mobileAndTabletCheck();
    }

    create() {
        this.input.addPointer(3);
        ui = this;
        this.camera = this.cameras.main;

        this.text = this.add.text(240, 250, " ", {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '32px',
            color: textColor,
            align: 'center'
        }).setDepth(12).setOrigin(.5, .5).setScrollFactor(0).setLineSpacing(4).setResolution(3);

        this.mistakesText = this.PrintText("", 16, 5, 5);
        this.mistakesText.setOrigin(0, 0);

        this.dayCount = this.PrintText("", 16, 475, 0);
        this.dayCount.setOrigin(1, 0);

        this.trashIcon = this.add.sprite(5, 265, 'trashBag').setDepth(15).setScrollFactor(0);
        this.trashIcon.setOrigin(0, 1);
        this.trashIcon.setSize(4);
        this.trashIcon.visible = false;

        this.music = this.sound.add('music', {
            loop: true
        });
        this.music.play();
        this.showingMessage = false;
    }

    update() {
        /*if (currentScene.gameManager)
            this.mistakesText.text = currentScene.gameManager.GetMistakesString();*/
    }

    UpdateDay(day) {
        this.dayCount.text = "Día: " + day;
    }

    EnableGameUI() { }

    HideGameUI() { }

    EnableMenuUI() { }

    EnableTrashIcon() {
        this.trashIcon.visible = true;
    }

    DisableTrashIcon() {
        this.trashIcon.visible = false;
    }


    ShowSelectedItem(name) {
        this.text.text = name;
    }

    ShowPatientInfo(patient) {
        if (currentScene.pause) {
            return;
        }

        currentScene.pause = true;

        this.background = this.add.rectangle(240, 125, 155, 220, white).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(330, 23, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            ui.HidePatientInfo();
        });

        this.header = this.PrintText("Informe: ", 32, 175, 20, darkTextColor);
        this.header.setOrigin(0, 0);

        this.illness = this.PrintTextWrap("-" + patient.illness + " (" + illnessTypes[patient.illnessType] + ")", 16, 175, 50, darkTextColor, 120);
        this.illness.setOrigin(0, 0);
    }

    HidePatientInfo() {
        currentScene.pause = false;
        this.background.destroy();
        this.close.destroy();
        this.illness.destroy();
        this.header.destroy();
    }

    ShowEnd(mistakes) {
        this.text.text = " ";
        this.background = this.add.rectangle(240, 135, 400, 220, backgroundColor).setDepth(10).setScrollFactor(0).setOrigin(0.5);
        this.close = this.add.sprite(420, 46, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.LoadScene("mainMenu");
        });


        this.add.text(70, 40, "ERRORS:\n" + currentScene.gameManager.GetMistakesString(), {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '16px',
            color: textColor,
            align: 'Left'
        }).setDepth(15).setOrigin(0, 0).setScrollFactor(0).setResolution(3);

    }


    AddRemoveButton(id, name) {
        let x = 10;
        let y = 10 + (30 * (id + 1));

        let button = this.add.rectangle(x, y, 80, 20, darkBackgroundColor).setOrigin(0, 0).setDepth(11).setScrollFactor(0).setScale(1).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.player.Remove(id);
            ui.clothes[id].visible = true;
            this.text.destroy();
            this.close.destroy();
            this.destroy();
        }).on('pointerover', function (pointer) {
            button.color = darkBackgroundColor;
        }).on('pointerout', function (pointer) {
            button.color = backgroundColor;
        });

        button.text = ui.add.text(x + 4, y, name, {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '16px',
            color: textColor,
            align: 'Left'
        }).setDepth(15).setOrigin(0, 0).setScrollFactor(0).setResolution(3);

        button.close = ui.add.text(x + 76, y, "X", {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '16px',
            color: textColor,
            align: 'Left'
        }).setDepth(15).setOrigin(1, 0).setScrollFactor(0).setResolution(3);

        this.removeButtons[id] = button;
    }

    AddPieceToTable(x, y, key, id, name) {
        let p = this.add.sprite(x, y, key).setDepth(11).setScrollFactor(0).setScale(2).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            if (currentScene.player.PutOn(id)) {
                ui.AddRemoveButton(id, name);
                p.visible = false;
            }
        });
        p.name = name
        this.clothes[id] = p;
    }

    ShowClothes() {
        if (currentScene.pause) {
            return;
        }
        currentScene.pause = true;

        //this.background = this.add.rectangle(240, 135, 350, 180, 0xff6699).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(418, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            ui.HideClothes();
        });


        this.background = this.add.sprite(240, 135, 'tableB').setDepth(10).setOrigin(0.5, 0.5).setScrollFactor(0).setScale(2);

        this.clothes = Array(6);
        this.removeButtons = Array(6);

        this.AddPieceToTable(110, 100, 'GuantesB', ID_GUANTES, 'Guants');
        this.AddPieceToTable(200, 100, 'GorroB', ID_GORRO, 'Barret');
        this.AddPieceToTable(280, 100, 'MascarillaB', ID_MASCARILLA, 'Mascareta');
        this.AddPieceToTable(360, 100, 'GafasB', ID_GAFAS, 'Ulleres');
        this.AddPieceToTable(165, 192, 'CalzasB', ID_CALZAS, 'Calçes');
        this.AddPieceToTable(330, 190, 'BataB', ID_BATA, 'Bata');

        for (let index = 0; index < this.clothes.length; index++) {
            this.clothes[index].on('pointerover', function (pointer) {
                ui.ShowSelectedItem(ui.clothes[index].name);
            })

            this.clothes[index].on('pointerout', function (pointer) {
                ui.ShowSelectedItem(" ");
            })
        }
    }

    HideClothes() {
        currentScene.pause = false;
        for (let i = 0; i < this.clothes.length; i++) {
            this.clothes[i].destroy();
        }
        for (let i = 0; i < this.removeButtons.length; i++) {
            if (this.removeButtons[i]) {
                this.removeButtons[i].text.destroy();
                this.removeButtons[i].close.destroy();
                this.removeButtons[i].destroy();
            }
        }
        this.background.destroy();
        this.close.destroy();
    }

    ShowSink() {
        if (currentScene.pause) {
            return;
        }
        currentScene.pause = true;

        this.background = this.add.sprite(240, 165, 'sinkB').setDepth(10).setOrigin(0.5, 0.5).setScrollFactor(0).setScale(2);


        this.soap = this.add.sprite(340, 64, 'soap').setDepth(11).setScale(2).setScrollFactor(0).setOrigin(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.gameManager.WashHands(false, currentScene.player.WearsAnyClothes());
            ui.HideSink();
            currentScene.CheckMistakes();
        });
        this.soap.name = "Sabó";
        this.soap.on('pointerover', function (pointer) {
            ui.ShowSelectedItem(this.name);
        })
        this.soap.on('pointerout', function (pointer) {
            ui.ShowSelectedItem(" ");
        })

        this.soap2 = this.add.sprite(230, 64, 'soapA').setDepth(11).setScale(2).setScrollFactor(0).setOrigin(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            currentScene.gameManager.WashHands(true, currentScene.player.WearsAnyClothes());
            ui.HideSink();
            currentScene.CheckMistakes();
        });
        this.soap2.name = "Sabó antisèptic";
        this.soap2.on('pointerover', function (pointer) {
            ui.ShowSelectedItem(this.name);
        })
        this.soap2.on('pointerout', function (pointer) {
            ui.ShowSelectedItem(" ");
        })


        this.close = this.add.sprite(418, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            ui.HideSink();
        });
    }

    HideSink() {
        currentScene.pause = false;
        this.soap.destroy();
        this.soap2.destroy();
        this.background.destroy();
        this.close.destroy();
    }

    ShowActions() {
        if (currentScene.pause || currentRoom.patient.takenCareOf) {
            return;
        }

        currentScene.pause = true;

        this.background = this.add.rectangle(240, 135, 350, 180, backgroundColor).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        this.close = this.add.sprite(400, 62, 'close').setDepth(12).setScrollFactor(0).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            ui.HideActions();
        });

        this.buttons = [];

        let a = this.add.text(300, 160, "aaaaaaaa", {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '32px',
            color: textColor,
            align: 'center'
        }).setDepth(10).setOrigin(.5, .5).setScrollFactor(0).setLineSpacing(4);

        a.setInteractive().on('pointerdown', function (event) {
            currentScene.player.CarryTrash(currentRoom.patient.illnessType);
            ui.EnableTrashIcon();
            ui.HideActions();
        }, this);

        this.buttons.push(a);
    }

    HideActions() {
        currentScene.pause = false;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].destroy();
        }
        this.background.destroy();
        this.close.destroy();
    }

    ShowRoomManager() {
        this.items = [];
        currentScene.pause = true;

        this.background = this.add.rectangle(240, 135, 480, 270, backgroundColor).setDepth(10).setScrollFactor(0).setOrigin(0.5);
        this.ok = this.add.text(240, 250, "OK", {
            fontFamily: 'BetterPixelsAcce',
            fontSize: '32px',
            color: textColor,
            align: 'left'
        }).setDepth(10).setOrigin(0.5, 0.5).setScrollFactor(0).setLineSpacing(4).setResolution(3).setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            ui.HideRoomManager();
        });

        //this.add.sprite(240, 250, 'close').setDepth(12).setScrollFactor(0)

        this.pressures = [0, 0, 0, 0];
        this.roomTypes = [0, 0, 0, 0];

        for (let i = 0; i < currentScene.rooms.length; i++) {
            let x = 60;
            let y = 20 + (60 * i);

            let patient = currentScene.rooms[i].patient;
            let patientSprite = this.add.sprite(x, y + 10, "pacientes").setDepth(12).setScrollFactor(0).setScale(3).setFrame(patient.frame.name);
            patientSprite.angle = 90;
            let patientText = this.add.text(20 + x, y, patient.illness, {
                fontFamily: 'BetterPixelsAcce',
                fontSize: '16px',
                color: textColor,
                align: 'left'
            }).setDepth(10).setOrigin(0, 0.5).setScrollFactor(0).setLineSpacing(4).setResolution(3);

            let pressureButton = this.add.text(30 + x, y + 20, "Pressió: SENSE PRESSIÓ", {
                fontFamily: 'BetterPixelsAcce',
                fontSize: '16px',
                color: textColor,
                align: 'left'
            }).setDepth(10).setOrigin(0, 0.5).setScrollFactor(0).setLineSpacing(4).setResolution(3).setInteractive().on('pointerdown', function () {
                switch (this.pressure) {
                    case NO_PRESSURE:
                        this.pressure = POS_PRESSURE;
                        this.text = "Pressió: PRESSIÓ POSITIVA"
                        break;
                    case POS_PRESSURE:
                        this.pressure = NEG_PRESSURE;
                        this.text = "Pressió: PRESSIÓ NEGATIVA"
                        break;
                    case NEG_PRESSURE:
                        this.pressure = NO_PRESSURE;
                        this.text = "Pressió: SENSE PRESSIÓ"
                        break;
                    default:
                        break;
                }
                ui.pressures[this.id] = this.pressure;
            });

            pressureButton.id = i;
            pressureButton.pressure = NO_PRESSURE;

            let roomTypeButton = this.add.text(220 + x, y + 20, "Habitació: SENSE AVANTSALA", {
                fontFamily: 'BetterPixelsAcce',
                fontSize: '16px',
                color: textColor,
                align: 'left'
            }).setDepth(10).setOrigin(0, 0.5).setScrollFactor(0).setLineSpacing(4).setResolution(3).setInteractive().on('pointerdown', function () {
                this.roomType = !this.roomType;
                if (this.roomType) {
                    this.text = "Habitació: AMB AVANTSALA";
                } else {
                    this.text = "Habitació: SENSE AVANTSALA";
                }

                ui.roomTypes[this.id] = this.roomType;
            });

            roomTypeButton.id = i;
            roomTypeButton.roomType = false;

            this.items.push(patientSprite);
            this.items.push(patientText);
            this.items.push(pressureButton);
            this.items.push(roomTypeButton);
        }
    }

    HideRoomManager() {
        currentScene.pause = false;
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].destroy();
        }
        this.background.destroy();
        this.ok.destroy();

        currentScene.gameManager.CheckRoomMistakes(this.pressures, this.roomTypes);
        currentScene.CheckMistakes();
    }

    PrintText(text, size = 16, x = 0, y = 0, color = textColor) {
        let t = this.add.text(x, y, text, {
            fontFamily: 'BetterPixelsAcce',
            fontSize: size + 'px',
            color: color,
            align: 'left'
        }).setDepth(15).setOrigin(.5, .5).setScrollFactor(0).setLineSpacing(4).setResolution(3);

        return t;
    }

    PrintTextWrap(text, size = 16, x = 0, y = 0, color = textColo, wrap = 100) {
        let t = this.add.text(x, y, text, {
            fontFamily: 'BetterPixelsAcce',
            fontSize: size + 'px',
            color: color,
            align: 'left',
            wordWrap: { width: wrap, useAdvancedWrap: true } // Enable word wrapping
        }).setDepth(15).setOrigin(.5, .5).setScrollFactor(0).setLineSpacing(4).setResolution(3);

        return t;
    }

    ShowMessage(message) {
        let m = this.PrintText(message, 16, 240, 135);
        m.alpha = 0;
        this.showingMessage = true;

        let tween = this.tweens.add({
            targets: [m],
            //alpha: 0,
            // alpha: '+=1',
            alpha: {
                from: 0,
                to: 1
            },
            // alpha: { start: 0, to: 1 },  
            // alpha: { start: value0, from: value1, to: value2 },  
            // alpha: function(target, key, value, targetIndex, totalTargets, tween)  { return newValue; },
            // alpha: {
            //      getActive: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; },
            //      getStart: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; },
            //      getEnd: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; }
            // },
            ease: 'Cubic', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 2000,
            repeat: 0, // -1: infinity
            yoyo: true,
            onComplete() {
                ui.showingMessage = false;
            }
        });

    }
}

//https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};