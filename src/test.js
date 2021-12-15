import database from "better-sqlite3";

const db = database('assets/directory.db');

const arr = []

db.prepare('SELECT * FROM directory').all()
    .filter(({description}) => description.toLowerCase().includes('student') && !description.toLowerCase().includes('faculty'))
    .forEach(({description}) => {
    const i = description.indexOf('/')
        const c = description.substring(i - 2, i)
        console.log(description.substring(i + 1))
    arr.push(c)
})

console.log(new Set(arr))
