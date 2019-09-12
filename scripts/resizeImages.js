const talks = require('./../resources/talks.json');
const {
  mkdir,
  exists,
  readdir,
  unlink
} = require('fs');
const {
  promisify
} = require('util');

const [mkdirAsync, existsAsync, readAsync, unlinkAsync] = [
  promisify(mkdir),
  promisify(exists),
  promisify(readdir),
  promisify(unlink),
];

const Jimp = require('jimp');
const folder_600x600 = `600x600`;
const folder_800x800 = `800x800`;
const folder_1024x1024 = `1024x1024`;

const sizes = [folder_1024x1024, folder_600x600, folder_800x800];

async function reScale(myPath, size) {
  const finalFolder = `${myPath}/${size}`;
  try {
    await mkdirAsync(`${finalFolder}`);
  } catch (e) {}

  const files = await readAsync(myPath);
  const items = files.filter(
    item =>
    item !== '.DS_Store' && item !== 'video.mp4' && !~sizes.indexOf(item),
  );

  const outPut = `${finalFolder}`;
  const resolutions = [];
  for (file of items) {
    if (file === '.DS_Store') {
      await unlinkAsync(file);
      continue;
    }
    const pathFile = `${myPath}/${file}`;
    // console.log('file', pathFile);
    console.log('creating', `${outPut}/${file}`);
    const lenna = await Jimp.read(pathFile);
    const [w, h] = size.split('x').map(parseInt);
    const result = new Promise((resolve, reject) => {
      lenna
        .scaleToFit(w, h)
        .write(`${outPut}/${file}`, (err, res) =>
          err ? reject(err) : resolve(res),
        );
    });

    resolutions.push(result);
  }
  return resolutions;
}

async function main() {
  const items = talks
    .filter(
      item =>
      ~item.photos.indexOf("2019-09"),
    )
    .filter(({
      photos
    }) => !!photos);

  for (const {
      photos
    } of items) {
    await reScale(`../${photos}`, folder_800x800);
  }
}
main();