const talks = require('./../resources/talks.json');
const { mkdir, exists, readdir, unlink } = require('fs');
const { promisify } = require('util');

const [mkdirAsync, existsAsync, readAsync, unlinkAsync] = [
  promisify(mkdir),
  promisify(exists),
  promisify(readdir),
  promisify(unlink),
];

const Jimp = require('jimp');
const folder_600x600 = `600x600`;
const folder_1024x1024 = `1024x1024`;

const sizes = [folder_1024x1024, folder_600x600];

async function reScale(myPath, size) {
  const finalFolder = `${myPath}/${size}`;
  //   const exist = await existsAsync(`${finalFolder}`);
  //   console.log(`exist? ${exist}: ${finalFolder}`);
  try {
    await mkdirAsync(`${finalFolder}`);
  } catch (e) {}
  //   if (!exist) await mkdirAsync(`${finalFolder}`);

  const files = await readAsync(myPath);
  const items = files.filter(
    item => item !== '.DS_Store' && !~sizes.indexOf(item),
  );

  const outPut = `${finalFolder}`;

  for (file of items) {
    if (file === '.DS_Store') {
      await unlinkAsync(file);
      continue;
    }
    const pathFile = `${myPath}/${file}`;
    // console.log('file', pathFile);
    console.log('creating', `${outPut}/${file}`);
    const lenna = await Jimp.read(pathFile);
    lenna
      .scaleToFit(600, 600)
      .quality(100)
      .write(`${outPut}/${file}`);
  }
}

async function main() {
  const items = talks.filter(({ photos }) => !!photos);

  const t = items.map(({ photos }) => reScale(`../${photos}`, folder_600x600));
  const t2 = items.map(({ photos }) =>
    reScale(`../${photos}`, folder_1024x1024),
  );

  try {
    await Promise.all([...t, ...t2]);
    process.exit(0);
  } catch (error) {
    console.log('error', error);
    process.exit(0);
  }
  //   console.log('final', final);
}
main();
