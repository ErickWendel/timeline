const json2md = require("json2md")
const {
    readFileSync,
    writeFileSync
} = require('fs')

const talks = JSON.parse(readFileSync('resources/talks.json'))

const md = talks.map(talk => {
    let tags = talk.tags.map(i => `\`${i}\``).join(', ')
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
            p: `_Tags: ${tags}_`
        }
    ]
})

const data = readFileSync('resources/template.md', 'utf8').toString()
const final = md.reduce((prev, next) => prev.concat(next), [])
const content = data.replace('$$content$$', json2md(final))
console.log('content', content)

writeFileSync('README.md', content)
console.log('readme generated with success!')