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
const folder_1024x1024 = `1024x1024`;

const sizes = [folder_1024x1024, folder_600x600];

async function reScale(myPath, size) {
  const finalFolder = `${myPath}/${size}`;

  try {
    if (!(await existsAsync(`${finalFolder}`)))
      await mkdirAsync(`${finalFolder}`);

    const files = await readAsync(myPath);
    const items = files.filter(
      item => item !== '.DS_Store' && !~sizes.indexOf(size),
    );

    const outPut = `${finalFolder}`;

    for (file of items) {
      if (file === '.DS_Store') continue;
      const pathFile = `${myPath}/${file}`;
      console.log('file', pathFile);
      console.log('creating', `${outPut}/${file}`);
      const lenna = await Jimp.read(pathFile);
      lenna
        .scaleToFit(600, 600)
        .quality(60)
        .write(`${outPut}/${file}`);
    }
  } catch (err) {
    console.log('error', err);
    throw err;
  }
}

async function main() {
  const items = talks
    .filter(({ photos }) => !!photos)
    .map(({ title, date, photos }) => ({ title, date, photos }));

  //   const t = items.map(({ photos }) => console.log('photos', photos));
  const t = items.map(({ photos }) => reScale(`../${photos}`, folder_600x600));
  //   const t = items.map(({ photos }) => reScale(`../${photos}`, folder_1024x1024));
  return Promise.all(t);
  //   console.log('final', final);
}
main();
