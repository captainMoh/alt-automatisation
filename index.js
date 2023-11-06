//const cardJson = require('./card.json');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const getInformations = () => {
    //const taskAltArray = cardJson.checklists.find(object => object.name === 'Texte alt').checkItems;
    const excelFile = xlsx.readFile('balise.xlsx');
    const worksheet = excelFile.Sheets['Feuil1'];
    const taskAltArray = xlsx.utils.sheet_to_json(worksheet);

    const imageArray = [];
    const regex = /img.*?\.[a-zA-Z0-9]+/g;

    taskAltArray.forEach(cell => {
        const urlImg = cell.liens.match(regex);
        const altImg = cell.alt.trim();

        if(urlImg !== null) {
            imageArray.push({
                'link': urlImg[0],
                'alt': altImg
            });
        }
    });

    return imageArray;
}

const updateAlt = (filePath, objects) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const regexImg = /<img[^>]+src=["']([^"']+?)["']([^>]*)>/g;
        const dataUpdate = data.replace(regexImg, (match, src, attrs) => {
            const object = objects.find(obj => src.includes(obj.link));
            if (object !== undefined) {
                const alt = object.alt;
                if (attrs.includes('alt')) {
                    // Si l'attribut alt existe déjà, on le met à jour
                    return match.replace(/alt="([^"]*)"/, `alt="${alt}"`);
                }
                // Si l'attribut alt n'existe pas, on l'ajoute
                return match.replace(/(\/?>|>)/, ` alt="${alt}"/>`);
            }
            return match;
        });


        fs.writeFile(filePath, dataUpdate, 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
            console.log('Alt tags updated successfully.');
        });
    } catch (err) {
        return { 'erreur read: ': err };
    }
}

const directory = 'C:/wamp64/www/ravaliso28.fr/src';
const objectInfos = getInformations();

fs.readdir(directory, (err, files) => {
    if (err) {
        console.log(err);
    };

    files.forEach(file => {
        const filePath = path.join(directory, file);
        updateAlt(filePath, objectInfos);
    });
})