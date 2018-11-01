const json2md = require("json2md")
const {
    readFileSync,
    writeFileSync
} = require('fs')

const BLOG_CONTENT_TAG = '$$blog-content$$'
const TALK_CONTENT_TAG = '$$talk-content$$'

function sortByDate(prev, next) {

    const prevDate = new Date(prev.date)
    const nextDate = new Date(next.date)

    if (prevDate < nextDate) return 1
    if (prevDate > nextDate) return -1
    return 0

}

function mapPostMarkdown(item) {
    item.tags = item.tags.map(i => `\`${i}\``).join(', ')
    return [{
            h3: `[${item.date} - ${item.title} (${item.language})](${item.link})`
        }, {
            p: `Portal:`
        },
        {
            blockquote: `[${item.portal.name}](${item.portal.link})`
        },
        {
            p: "Abstract:"
        },
        {
            blockquote: item.abstract
        },
        {
            p: `_Tags: ${item.tags}_`
        }
    ];
}

function mapTalkMarkdown(item) {
    item.tags = item.tags.map(i => `\`${i}\``).join(', ')
    return [{
            h3: `${item.date} - ${item.title} (${item.language})`
        }, {
            p: `[${item.event.name}](${item.event.link})`
        },
        {
            p: `[slides](${item.slides}) ${item.photos ? `| [photos](${item.photos})` : ``} ${item.video ? `| [video](${item.video})`: ``}`
        },
        {
            p: "Abstract:"
        },
        {
            blockquote: item.abstract
        },
        {
            p: `_Tags: ${item.tags}_`
        }
    ];
}


(() => {
    const talks = getTextFile('resources/talks.json')

    const talksMd = talks.sort(sortByDate).map(mapTalkMarkdown).reduce((prev, next) => prev.concat(next), [])
    const data = readFileSync('resources/template.md', 'utf8').toString()

    const post = getTextFile('resources/posts.json')
    const postMd = post.sort(sortByDate).map(mapPostMarkdown).reduce((prev, next) => prev.concat(next), [])

    const content = data
        .replace(TALK_CONTENT_TAG, json2md(talksMd))
        .replace(BLOG_CONTENT_TAG, json2md(postMd))

    // console.log('content', content)

    writeFileSync('README.md', content)
    console.log('readme generated with success!')

})()

function getTextFile(path) {
    return JSON.parse(readFileSync(path));
}