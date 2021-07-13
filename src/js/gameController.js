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
                    mistakes.push({ "mistake": "No llevaba bata", "value": 1 });
                }

                console.log("Achís");
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