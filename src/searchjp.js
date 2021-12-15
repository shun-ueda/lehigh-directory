import database from 'better-sqlite3'
import { surnames, ch_surnames } from "./surnames.js";

const db = database('assets/directory.db');
const stats = {}

const surname_lib = surnames

console.log('Following students are potentially Japanese:\n')
db.prepare('SELECT * FROM directory').all()
    .filter(({last_name, description}) => surname_lib.includes(last_name.toLowerCase()) && !description.includes('Faculty'))
    .map(({first_name, last_name, email_address}) => {
        const year = email_address.substring(4, 6)
        if (stats[year.toString()] === undefined) {
            stats[year.toString()] = 1
        } else {
            stats[year.toString()]++
        }
        return `${first_name} ${last_name} '${year}`
    })
    .forEach(e => process.stdout.write(e + "   "))
console.log()
console.table(stats)
let sum = 0;
Object.entries(stats).forEach(([_, cnt]) => sum += cnt)
console.log(`Sum: ${sum}`)