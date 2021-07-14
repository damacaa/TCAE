class GameController {
    constructor() {

    }

    CheckMistakes(patient, player) {
        let mistakes = [];

        //Cuando sale de la habitación se llama a esta función y se le pasa el paciente
        switch (getIsolationType(patient.illness)) { //Segun tipo de aislamiento se aplican unas medidas
            case "a":
                //Comprobar medidas para tipo de aislamiento a
                if (!player.Wears(ID_BATA)) {
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
                }
                //console.log("Achís");
                break;
            default:
                break;
        }

        return mistakes;
    }
}

function getIsolationType(illness) {
    //Según enfermedad se aplica un tipo de aislamiento
    switch (illness) {
        case "constipao":
            return "a";
            break;
        default:
            break;
    }
}