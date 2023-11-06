// const cardJson = require('./card.json');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const getInformations = () => {
    // const taskAltArray = cardJson.checklists.find(object => object.name === 'alt').checkItems;
    const excelFile = xlsx.readFile('balise.xlsx');
    const worksheet = excelFile.Sheets['Feuil1'];
    const taskAltArray = xlsx.utils.sheet_to_json(worksheet);

    const imageArray = [];
    const regex = /img.*?\.[a-zA-Z0-9]+/g;

    taskAltArray.forEach(task => {
        const urlImg = task.liens.match(regex);
        const altImg = task.alt.trim();

        if (urlImg !== null) {
            imageArray.push({
                'link': urlImg[0],
                'alt': altImg
            });
        }
    });

    return imageArray;
}

const writeSqlQuery = (data) => {
    let query = "UPDATE table\n SET alt = CASE\n ";

    data.forEach(item => {
        query += `WHEN image = "${item.link}" THEN "${item.alt}"\n`;
    })
    query += "END;";
    return query;
}

const objectInfos = getInformations();

const sqlQuery = writeSqlQuery(objectInfos);

console.log(sqlQuery);

/*
UPDATE gallery1
 SET alt = CASE
 WHEN image = "img/palais77/71811b5ad3cf3d784df68f18127e80af.jpg" THEN "Fleurs qui remplissent les rampes d'escaliers"
WHEN image = "img/palais77/d58f2ef8dac53c494f27528a7781dfba.jpg" THEN "Fleurs posé au fond des escaliers et des fleurs qui remplissent les rampes"
WHEN image = "img/palais77/1d2174d1f2454f7330e747ef6d660ff9.jpg" THEN "Escalier décoré avec des fleurs"
WHEN image = "img/palais77/c2a04ae1edcd49d27ddef470bd8144c8.jpg" THEN "Escalier avec un lustre au plafond"
WHEN image = "img/palais77/2d18c6e931c0b3ce802d668570f6928c.jpg" THEN "Une salle avec des tables et chaises blanches."
WHEN image = "img/palais77/037aef0c81d304d46b6f8bb74e9f7fab.jpg" THEN "Une salle avec un escalier blanc à son centre"
WHEN image = "img/palais77/49b10b9690533b6a4f49e0265192c81b.jpg" THEN "4 tables blanches avec des chaises sous une terasse."
WHEN image = "img/palais77/b41a3fe07763612dd9a898f5d58fd600.jpg" THEN "Une salle décoré par un jeu de lumière"
WHEN image = "img/palais77/fc831790edc6d55128d483d405300fc1.jpg" THEN "Salle décoré avec des luminaires au plafond, des tables et chaise blanche ainsi que des couverts."
WHEN image = "img/palais77/3176999ac26232ff391ac4cf7788f233.jpg" THEN "Salle décorée avec des luminaires, des fleurs blanches dans des vases."
WHEN image = "img/palais77/868fffa829a5ee71b6e34ad6320f5b08.jpg" THEN "Salle décorée, il y a beaucoup de tables et chaises"
END;
*/
