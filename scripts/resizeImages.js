const talks = require('./../resources/talks.json');
const { mkdir, exists, readdir } = require('fs');
const { promisify } = require('util');

const [mkdirAsync, existsAsync, readAsync] = [
  promisify(mkdir),
  promisify(exists),
  promisify(readdir),
];

const Jimp = require('jimp');
const folder_600x600 = `600x600`;
// const myPath = '../2015-06-12-webscraping_com_c#';

async function reScale(myPath) {
  if (!(await existsAsync(`${myPath}/${folder_600x600}`)))
    await mkdirAsync(`${myPath}/${folder_600x600}`);
  try {
    const files = await readAsync(myPath);
    const items = files.filter(
      item => item !== '.DS_Store' && item !== folder_600x600,
    );

    const outPut = `${myPath}/${folder_600x600}`;

    for (file of items) {
      if (file === '.DS_Store') continue;
      console.log('reading', file);

      const lenna = await Jimp.read(`${myPath}/${file}`);
      lenna
        .scaleToFit(600, 600)
        .quality(60)
        .write(`${outPut}/${file}`);
    }
  } catch (err) {
    console.log('error', err);
  }
}

async function main() {
  const items = talks
    .filter(({ photos }) => !!photos)
    .map(({ title, date, photos }) => ({ title, date, photos }));

  const t = items.map(({ photos }) => reScale(`../${photos}`));
  const final = await Promise.all(t);
  console.log('final', final);
}
main();
