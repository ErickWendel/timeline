const json2md = require("json2md")
const {
    readFileSync,
    writeFileSync
} = require('fs')
const talks = JSON.parse(readFileSync('resources/talks.json'))

const str = talks.map(talk => {
    return json2md([{
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
        }, {
            p: `_Tags: ${talk.tags.map(i => `\`${i}\``).join(', ')}_`
        }
    ])
})
const data = readFileSync('resources/template.md', 'utf8').toString()

const content = data.replace('$$content$$', str)
console.log('content', content)

writeFileSync('new-template.md', content)