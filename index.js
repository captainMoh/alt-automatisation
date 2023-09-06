const cardJson = require('./card.json');
const fs = require('fs');
const path = require('path');

const getInformations = () => {
    const taskAltArray = cardJson.checklists.find(object => object.name === 'Texte alt ').checkItems;
    const imageArray = [];
    const regex = /img.*?\.[a-zA-Z0-9]+/g;

    taskAltArray.forEach(task => {
        const urlImg = task.name.match(regex);
        const altImg = task.name.split(':')[2].trim();

        imageArray.push({
            'link': urlImg[0],
            'alt': altImg
        });
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

const directory = 'C:/wamp64/www/www.taxi-78.com/htdocs/';
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