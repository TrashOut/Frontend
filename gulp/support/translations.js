/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2017 TrashOut, n.f.
 *
 * This file is part of the TrashOut project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
 */
const request = require('request'); // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs');
const querystring = require('querystring');

function downloadData(projectId, done) {
  const token = {
    api_token: '75c1ff7e8c5e718c3e55ac7c17f5d517',
    id: 97547,
  };
  console.log('get languages...');

  getProjectLanguages(querystring.stringify(token), (languages) => {
    Promise.all(languages.map(language => new Promise((resolve, reject) => {
      const languageToken = {
        api_token: '75c1ff7e8c5e718c3e55ac7c17f5d517',
        id: 97547,
        language: language.code,
      };
      getTerms(querystring.stringify(languageToken), language.code, resolve, reject);
    }))).then(() => done());
  });
}

function getProjectLanguages(data, callback) {
  const options = {
    method: 'POST',
    url: 'https://api.poeditor.com/v2/languages/list',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
    },
    body: data,
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);


    const languages = body.result.languages.map(language => ({
      name: language.name,
      code: language.code,
    }));

    console.log(`Languages: ${languages.length}`);
    callback(languages);
  });
}

function getTerms(data, languageCode, resolve, reject) {
  const options = {
    method: 'POST',
    url: 'https://api.poeditor.com/v2/terms/list',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
    },
    body: data,
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    const getDefaultMessage = (translation, term) => {
      if (!translation) {
        return `#${term}`;
      }

      return translation.replace('%d', '{number}').replace('%s', '{string}');
    };

    const terms = body.result.terms;
    const exportData = body.result.terms.map(({ term, translation: { content: translation } }) => ({
      id: term,
      defaultMessage: getDefaultMessage(translation, term),
    }));

    console.log(`Terms count: ${terms.length}`);

    let exportString = '/* eslint-disable */\n';
    exportString += `/* TrashOut React localization file - language: ${languageCode}*/\n`;
    exportString += 'export default ';
    exportString += JSON.stringify(exportData, null, '\t');

    fs.writeFile(`messages/${languageCode}.js`, exportString, (err) => {
      if (err) {
        console.log(err);
        return reject();
      }

      console.log(`The file ${languageCode} was saved!`);
      return resolve();
    });
  });
}

module.exports = downloadData;
