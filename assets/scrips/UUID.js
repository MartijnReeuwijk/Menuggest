function uuid (loops) {
  let id = ''
  const looping = loops || 1
  const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  for (let i = 0; i < looping; i++) {
    numberArray.forEach(() => {
      const number = Math.floor(Math.random() * 10)
      const randomNumber = numberArray[Math.floor(Math.random() * numberArray.length)]
      const randomAlphabet = alphabet[Math.floor(Math.random() * alphabet.length)]
      if (number % 2 === 0) {
        id += randomNumber
      } else {
        id += randomAlphabet
      }
    })
  }

  return id
}

module.exports = {
  uuid
}
