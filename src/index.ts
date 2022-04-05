const alphabet = [...Array(26).keys()].map(e => String.fromCharCode(e + 97))
const patterns = alphabet.map(a => alphabet.map(b => a + b))

console.log(patterns)
