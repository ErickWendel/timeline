const { get } = require('axios');
const talks = require('./resources/talks.json');
const { writeFileSync } = require('fs');

(async () => {
  const links = talks
    .filter(({ photos }) => !!photos)
    .map(({ title, date, photos }) => ({ title, date, photos }));
  // .map(({ photos }) => console.log('photos', photos));
  const naoencontrados = [];
  for (item of links) {
    const { title, date, photos } = item;

    console.log('title', title);
    try {
      const t = await get(
        `https://github.com/ErickWendel/timeline/tree/master/${photos}`,
      );
      console.log(t.status);
    } catch (e) {
      const status = e.response.status;
      if (status === 404) {
        console.log('title nào encontrado!', title);
        naoencontrados.push(item);
      }
    }
  }

  writeFileSync('./naoencontrados.json', JSON.stringify(naoencontrados));
})();
