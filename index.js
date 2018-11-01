const json2md = require("json2md")
const {
    readFileSync,
    writeFileSync
} = require('fs')

const BLOG_CONTENT_TAG = '$$blog-content$$'
const TALK_CONTENT_TAG = '$$talk-content$$'
const VIDEO_CONTENT_TAG = '$$video-content$$'
const REPOSITORY = 'https://github.com/ErickWendel/timeline'

function sortByDate(prev, next) {

    const prevDate = new Date(prev.date)
    const nextDate = new Date(next.date)

    if (prevDate < nextDate) return 1
    if (prevDate > nextDate) return -1
    return 0

}

function getTextFile(path) {
    return JSON.parse(readFileSync(path));
}

function mapPostMarkdown(item) {
    return [{
            h3: convertLink(item.link, `${item.date} - ${item.title} (${item.language})`)
        }, {
            p: `Portal:`
        },
        {
            blockquote: convertLink(item.portal.link, item.portal.name)
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
    const contentSession = mapContentLinks(item);

    return [{
            h3: `${item.date} - ${item.title} (${item.language})`
        }, {
            p: convertLink(item.event.link, item.event.name)
        },
        {
            p: contentSession
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

    function mapExternalLinks(link) {
        const githubContentLink = `${REPOSITORY}/tree/master/`
        if (~link.indexOf('http')) return link

        return `${githubContentLink}${link}`
    }

    function mapContentLinks(item) {
        const slidesText = convertLink(item.slides, 'slides');
        const videoText = `${item.video ? `| ${convertLink(mapExternalLinks(item.video), 'video')}` : ``}`;
        const photoText = `${item.photos ? `| ${convertLink(mapExternalLinks(item.photos), 'photos')}` : ``}`;
        const contentSession = `${slidesText} ${photoText} ${videoText}`;
        return contentSession;
    }
}

function convertLink(link, text) {
    return `<a href="${link}" target="_blank">${text}</a>`
}

function mapTags(item) {
    item.tags = item.tags.map(i => `\`${i}\``).join(', ')
    return item
}

function mapContent() {

}

function mapVideoMarkdown(item) {
    return [{
            h3: convertLink(item.link, `${item.date} - ${item.title} (${item.language})`)
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

function mapMarkdown(items, fn) {
    return items.sort(sortByDate).map(item => fn(mapTags(item))).reduce((prev, next) => prev.concat(next), [])
}

(() => {
    const data = readFileSync('resources/templates/template.md', 'utf8').toString()

    const talks = getTextFile('resources/talks.json')
    const talksMd = mapMarkdown(talks, mapTalkMarkdown)

    const posts = getTextFile('resources/posts.json')
    const postMd = mapMarkdown(posts, mapPostMarkdown)

    const videos = getTextFile('resources/videos.json')
    const videosMd = mapMarkdown(videos, mapVideoMarkdown)


    const content = data
        .replace(TALK_CONTENT_TAG, json2md(talksMd))
        .replace(BLOG_CONTENT_TAG, json2md(postMd))
        .replace(VIDEO_CONTENT_TAG, json2md(videosMd))

    // console.log('content', content)

    writeFileSync('README.md', content)
    console.log('readme generated with success!')

})()