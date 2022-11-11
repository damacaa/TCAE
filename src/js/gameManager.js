const MAX_PATIENTS = 4;
class GameManager {
    constructor(scene) {
        this.scene = scene;
        this.Reset();
        this.scene.entities.push(this);
    }

    Reset() {
        this.patients = [];
        this.mistakes = [];
        this.mistakesToShow = [];
        this.treatedPatients = [];
        this.washedHands = false;
        this.washedHandsAntiseptic = false;

        for (let index = 0; index < MAX_PATIENTS; index++) {
            this.patients.push(new PatientInfo());
        }

        for (let i = 0; i < MAX_PATIENTS; i++) {
            this.scene.rooms.push(new Room(this.scene, 112 + (128 * i), 0, this.patients[i], i));
        }
    }

    Update(time,delta){
        if(this.mistakesToShow.length > 0 && !ui.showingMessage ){
            ui.ShowMessage(this.mistakesToShow[0]);
            this.mistakesToShow.shift();
        }
    }

    CheckMistakesGoingIn(patient, player) {
        //Cuando sale de la habitación se llama a esta función y se le pasa el paciente
        let checks = [];
        let garments = ["la bata", "les calçes", "les ulleres", "la mascareta", "el barret", "els guants"];
        //                bata   calzas gafas  mascar gorro guantes
        switch (patient.illnessType) {
            case 0:
                checks = [true, true, false, true, true, true, false]
                break;
            case 1:
                checks = [true, true, false, true, true, true, true] //Ulleres might be true
                break;
            case 2:
                checks = [false, false, false, true, false, true, false]
                break;
            case 3:
                checks = [true, false, false, false, false, true, true]
                break;
            case 4:
                checks = [true, false, false, true, false, true, true]
                break;
            default:
                checks = [false, false, false, false, false, false, false]
                break;
        }

        for (let index = 0; index <= 5; index++) {
            if (!player.Wears(index) && checks[index]) {
                this.AddMistake({
                    "mistake": "No portaves " + garments[index],
                    "val": 1
                });
            } else if (player.Wears(index) && !checks[index]) {
                this.AddMistake({
                    "mistake": "No necessitaves " + garments[index],
                    "val": 0
                });
            }
        }

        if (!this.washedHands) {
            this.AddMistake({
                "mistake": "No t'has llavat les mans!",
                "val": 1
            });
        }

        if (!this.washedHandsAntiseptic && checks[6]) {
            this.AddMistake({
                "mistake": "No has utilitzat el sabó antisèptic",
                "val": 1
            });
        } else if (this.washedHandsAntiseptic && !checks[6]) {
            this.AddMistake({
                "mistake": "No necessitaves el sabó antisèptic",
                "val": 0
            });
        }

        //Check if player has visited this room in a wrong order
        if (patient.illnessType != 0 && patient.illnessType != 4) {
            for (let i = 0; i < this.treatedPatients.length; i++) {
                if (patient.illnessType == 0 && patient.illnessType == 4) {
                    this.AddMistake({
                        "mistake": "No has seguit l'ordre correcte per a atendre als pacients",
                        "val": 1
                    });
                }
            }
        }

        this.treatedPatients.push(patient);
    }

    CheckMistakesGoingOut(patient, player) {

        if (player.carriesTrash && !player.firstBag) {
            this.AddMistake({
                "mistake": "No has usado la primera bolsa",
                "val": 0
            });
        }

        this.UpdateUI();
    }

    CheckTrash(index, player) {
        if (!player.carriesTrash) {
            return;
        }

        if (index != player.trashId) {
            this.AddMistake({
                "mistake": "Contenidor incorrecte",
                "val": 1
            });
        }

        if (!player.secondBag) {
            this.AddMistake({
                "mistake": "No has usat la segona bossa",
                "val": 0
            });
        }

        player.ThrowTrash();
    }

    CheckRoomMistakes(pressures, roomTypes) {
        for (let i = 0; i < this.scene.rooms.length; i++) {
            if (pressures[i] != this.scene.rooms[i].pressure) {
                this.AddMistake({
                    "mistake": "La pressió de l'habitació " + (i + 1) + " no és correcta",
                    "val": 0
                });
            }

            if (roomTypes[i] != this.scene.rooms[i].hasAnteroom) {
                this.AddMistake({
                    "mistake": "No has triat l'habitació correcta per al pacient " + (i + 1),
                    "val": 0
                });
            }
        }
    }

    WashHands(antiseptic, wearsAnyClothes) {
        if (wearsAnyClothes) {
            this.AddMistake({
                "mistake": "T'has llavat les mans després d'haver-te vestit",
                "val": 0
            });
        }

        this.washedHands = true; ////////////SARA HA ESCRITO AQUI
        if (antiseptic) {
            console.log("Washing hands with antiseptic");
            this.washedHandsAntiseptic = true;
        } else {
            console.log("Washing hands");
        }
    }

    GetMistakesString() {
        let s = "";
        for (let i = 0; i < this.mistakes.length; i++) {
            s += this.mistakes[i]["mistake"] + "\n";
        }
        return s;
    }

    AddMistake(mistake) {
        if(mistake["val"] == 0){
            this.mistakesToShow.push(mistake["mistake"]);
        }else{
        }
        this.mistakes.push(mistake);
    }
}