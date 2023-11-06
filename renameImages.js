const cardJson = require('./card.json');
const fs = require('fs');
const path = require('path');

const getInformations = () => {
    const taskAltArray = cardJson.checklists.find(object => object.name === 'Texte alt').checkItems;
    const imageArray = [];
    const regex = /img\/PHOTOS_FEVRIER.*?\.[a-zA-Z0-9]+/g;

    taskAltArray.forEach(task => {
        const urlImg = task.name.match(regex) !== null ? decodeURIComponent(task.name.match(regex)[0]) : null;
        const altImg = task.name.split(':')[2].trim();


        imageArray.push({
            'link': urlImg,
            'alt': altImg
        });
    });

    return imageArray;
}

const dossierDeDepart = 'C:/wamp64/www/www.paysagisteparis.fr/htdocs/img';

const information = getInformations();

function parcourirDossierRecursivement(dossier) {
    fs.readdirSync(dossier).forEach((fichier) => {
        const cheminFichier = path.join(dossier, fichier);
        //console.log(cheminFichier);
        if (fs.statSync(cheminFichier).isDirectory()) {
            parcourirDossierRecursivement(cheminFichier);
        } else {
            const imageInfo = information.find((image) => cheminFichier.split('\\').join('/').includes(image.link));
            //console.log(imageInfo);
            if (imageInfo) {
                const { alt } = imageInfo;
                const nouveauNom = `${alt}.${fichier.split('.').pop()}`;
                const nouveauCheminFichier = path.join(dossier, nouveauNom);

                fs.renameSync(cheminFichier, nouveauCheminFichier);
                console.log(`Renommé: ${cheminFichier} => ${nouveauCheminFichier}`);
            }
        }
    });
}

parcourirDossierRecursivement(dossierDeDepart);






