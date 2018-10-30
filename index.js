const json2md = require("json2md")
const {
    readFileSync,
    writeFileSync
} = require('fs')


function mapMarkdown(talk) {
    return [{
            h3: `${talk.date} - ${talk.title} (${talk.language})`
        }, {
            p: `[${talk.event.name}](${talk.event.link})`
        },
        {
            p: `[slides](${talk.slides}) | [photos](${talk.photos}) | [video](${talk.video})`
        },
        {
            p: "Abstract:"
        },
        {
            blockquote: talk.abstract
        },
        {
            p: `_Tags: ${talk.tags}_`
        }
    ];
}

function formatAnchorTitle(item, talk) {
    if (item) return item

    const formatedTile = talk.title
        .replace(/ /g, '-')
        .replace('(', "")
        .replace(')', "")
        .replace(',', "")
        .replace('.', "")
        .toLowerCase();

    const formatedLanguage = talk.language
        .replace('(', "")
        .replace(')', "");
    const anchor = `#${talk.date}---${formatedTile}-${formatedLanguage}`;
    return anchor;
};


(() => {
    const talks = JSON.parse(readFileSync('resources/talks.json'))

    const md = talks.map(talk => {
        talk.tags = talk.tags.map(i => `\`${i}\``).join(', ')
        talk.video = formatAnchorTitle(talk.video, talk);
        talk.photos = formatAnchorTitle(talk.photos, talk)
        return mapMarkdown(talk)
    })

    const data = readFileSync('resources/template.md', 'utf8').toString()
    const final = md.reduce((prev, next) => prev.concat(next), [])
    const content = data.replace('$$content$$', json2md(final))
    console.log('content', content)

    writeFileSync('README.md', content)
    console.log('readme generated with success!')

})()