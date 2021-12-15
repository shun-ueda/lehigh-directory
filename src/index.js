import fetch from 'node-fetch'
import cheerio from 'cheerio'
import database from 'better-sqlite3'

const alphabet = Array.from(Array(26)).map((e, i) => i + 97).map(x => String.fromCharCode(x));
const pattern = ['x']
alphabet.forEach(a => {
    alphabet.forEach(b => {
        pattern.push(a + b)
    })
})
const db = database('assets/directory.db');
const stmt = db.prepare('INSERT INTO directory (first_name, last_name, description, email_address, phone_number, title, campus_address) VALUES (?, ?, ?, ?, ?, ?, ?)')

let cnt = 0
setInterval(() => {
    fetch(`https://www.lehigh.edu/cgi-bin/ldapsearch/ldapsearch.pl?mail=${pattern[cnt]}*`)
        .then(res => res.text())
        .then(text => {
            const $ = cheerio.load(text);
            let isSingle = true
            $('tr', '#myTable > tbody').each((i, elem) => {
                const data = []
                isSingle = false
                $(elem).find('td').each((i2, td) => {
                    data.push($(td).text())
                })
                try {
                    stmt.run(...data)
                } catch (ingnored) {}
            })
            if (isSingle) {
                try {
                    stmt.run(
                        $('body > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
                        $('body > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').text(),
                        $('body > div > table > tbody > tr:nth-child(3) > td:nth-child(2)').text(),
                        $('body > div > table > tbody > tr:nth-child(4) > td:nth-child(2)').text(),
                        $('body > div > table > tbody > tr:nth-child(5) > td:nth-child(2)').text(),
                        "",
                        $('body > div > table > tbody > tr:nth-child(6) > td:nth-child(2)').text(),
                    )
                } catch (e) {}
            }
            cnt++
            if (cnt === pattern.length) {
                db.close()
                process.exit(0)
            }
        })
}, 1000)
