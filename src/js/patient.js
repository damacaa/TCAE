/*let malaltiesEsctrictes = ["Carboncle pulmonar", "Diftèria", "Staphylococcus aureus", "Estreptococos de tipus A", "Pèmfig del neunat", "Pesta", "Cremada extensa infectada", "Ràbia", "Varicel·la", "Herpes zòster disseminat", "Malatia pel virus de Marburg", "Ebola"]
let malaltiesProtectores = ["Agranulocitosi", "Dermatitis extensa no infectada", "Paciente immunodreprimit", "Trasplant", "Limfoma", "Leucèmia", "Cremada extensa", "Prematur"];
let malaltiesRespiratories = ["Tuberculosi pulmonar", "Pneumònia", "Tos ferina", "Xarampió", "Rubèola", "Parotiditis", "Infecció meningocòccica"];
let malaltiesEnteriques = ["Gastroenteritis per Escherichia coli", "Enterocolitis", "Còlera", "Febre tifoide", "Meningitis", "Salmonel·losi", "Poliomielitis", "Disenteries", "Hepatitis A", "Hepatitis B", "Hepatitis no A", "Hepatitis delta"];
let malaltiesCutaneomucoses = ["Cremada limitada", "Gangrena gasosa", "Ferides molt infectades", "Abscessos", "Candidiasi cutània", "Sarna", "Impetigen"]*/


let malaltiesEsctrictes = ["Diftèria", "Pesta", "Virus de l'èbola", "Varicel·la", "COVID-19", "Cremades extenses infectades"];
let malaltiesProtectores = ["Innmunodeprimit", "Trasplantats", "Grans cremats", "Prematurs", "Leucèmies"];
let malaltiesRespiratories = ["TBC", "Pallola", "Penumònia", "Rubèola", "Meningitis", "Parotiditis", "Tos ferina"];
let malaltiesEnteriques = ["Salmonel·losi", "Còlera", "Hepatitis A", "Disenteries", "GEA per E.Coli"];
let malaltiesCutaneomucoses = ["Cremades infectades", "Gangrena gaseosa", "Sarna", "Impetigen", "Ferides externes infectades"]
let illnessTypes = ["Estricte", "Protector", "Respiratori", "Entèric", "Cutaneomucós"];


class PatientInfo {
    constructor() {
        this.illnessType = Math.floor(Math.random() * 4.99);

        switch (this.illnessType) {
            case 0:
                //Estricte
                this.illness = malaltiesEsctrictes[Math.floor(Math.random() * malaltiesEsctrictes.length)];
                break;
            case 1:
                //Protector invers o de barrera inversa
                this.illness = malaltiesProtectores[Math.floor(Math.random() * malaltiesProtectores.length)];
                break;
            case 2:
                //Respiratori
                this.illness = malaltiesRespiratories[Math.floor(Math.random() * malaltiesRespiratories.length)];
                break;
            case 3:
                //Entèric
                this.illness = malaltiesEnteriques[Math.floor(Math.random() * malaltiesEnteriques.length)];
                break;
            case 4:
                //Cutaneomucós
                this.illness = malaltiesCutaneomucoses[Math.floor(Math.random() * malaltiesCutaneomucoses.length)];
                break;
            default:
                break;
        }
    }
}

class Patient extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, info) {
        super(scene, x, y, 'pacientes');

        this.scene = scene;
        this.scene.add.existing(this);
        this.info = info;

        this.setDepth(2).setOrigin(0).setFrame(Math.floor(Math.random() * 4));

        this.illness = info.illness;
        this.illnessType = info.illnessType;

        this.takenCareOf = false;
    }
}