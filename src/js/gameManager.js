const MAX_PATIENTS = 5;
class GameManager {
    constructor(scene) {
        this.scene = scene;
        this.patients = [];
        this.mistakes = [];

        for (let index = 0; index < MAX_PATIENTS; index++) {
            this.patients.push(new PatientInfo());
        }

        for (let i = 0; i < 4; i++) {
            scene.rooms.push(new Room(scene, 112 + (128 * i), 0, this.patients[i]));
        }
    }

    CheckMistakesGoingIn(patient, player) {
        //Cuando sale de la habitación se llama a esta función y se le pasa el paciente
        let checks = [];
        let garments = ["la bata", "les calçes", "les ulleres", "la mascareta", "el barret", "els guants"];
        //                bata   calzas gafas  mascar gorro guantes
        switch (patient.illnessType) {
            case 0:
                checks = [true, true, false, true, true, true]
                break;
            case 1:
                checks = [true, true, true, true, true, true]
                break;
            case 2:
                checks = [false, false, false, true, false, true]
                break;
            case 3:
                checks = [true, false, false, false, false, true]
                break;
            case 4:
                checks = [true, false, false, true, false, true]
                break;
            default:
                checks = [false, false, false, false, false, false]
                break;
        }

        for (let index = 0; index <= 5; index++) {
            if (!player.Wears(index) && checks[index]) {
                this.mistakes.push({ "mistake": "No portaves " + garments[index], "val": 1 });
            } else if (player.Wears(index) && !checks[index]) {
                this.mistakes.push({ "mistake": "No necessitaves " + garments[index], "val": 0 });
            }
        }



        /*if (!player.Wears(ID_BATA)) {
            mistakes.push({ "mistake": "No llevaba bata", "val": 1 });
        }
        if (!player.Wears(ID_GUANTES)) {
            mistakes.push({ "mistake": "No llevaba guantes", "val": 1 });
        }
        if (!player.Wears(ID_GORRO)) {
            mistakes.push({ "mistake": "No llevaba gorro", "val": 1 });
        }
        if (!player.Wears(ID_MASCARILLA)) {
            mistakes.push({ "mistake": "No llevaba mascarilla", "val": 1 });
        }
        if (!player.Wears(ID_GAFAS)) {
            mistakes.push({ "mistake": "No llevaba gafas", "val": 1 });
        }
        if (!player.Wears(ID_CALZAS)) {
            mistakes.push({ "mistake": "No llevaba calzas", "val": 1 });
        }
        if (!player.washedHands) {
            mistakes.push({ "mistake": "No se ha lavado las manos", "val": 1 });
        }*/

        this.UpdateUI();
    }

    CheckMistakesGoingOut(patient, player) {

        if (player.carriesTrash && !player.firstBag) {
            this.mistakes.push({ "mistake": "No has usado la primera bolsa", "val": 1 });
        }

        this.UpdateUI();
    }

    CheckTrash(index, player) {
        if (!player.carriesTrash) { return; }

        if (index != player.trashId) {
            this.mistakes.push({ "mistake": "Contendor incorrecto", "val": 1 });
        }

        if (!player.secondBag) {
            this.mistakes.push({ "mistake": "No has usado la segunda bolsa", "val": 1 });
        }

        player.ThrowTrash();
    }

    UpdateUI() { }

    AddMistake(m) {
        this.mistakes.push(m);
    }
}