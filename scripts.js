let wordsList = Array(100)

const btnGeneratePassword = document.querySelector(
  '[name=btn-generate-new-password]'
)
const btnCopyPassword = document.querySelector('[name=btn-copy-password]')
const inputShowNewPasswordEl = document.querySelector('[name=new_password]')
const btnReset = document.querySelector('[name=btn-reset]')
const separationRadios = document.querySelectorAll('[name=separation]')
const useMajuscules = document.querySelectorAll('[name=majuscules]')
const useSpecialCharRadios = document.getElementsByName('spec_char')

btnCopyPassword.addEventListener('click', copyToClipBoard)
btnGeneratePassword.addEventListener('click', showNewPassword)
btnReset.addEventListener('click', reset)

function randomIntByMax(n) {
  return Math.floor(Math.random() * (n + 1))
}

/**
 * Reset interface
 */
function reset() {
  location.reload()
}

function getSeparation() {
  const choiceSeparationEl = Array.from(separationRadios).find((radio) => radio.checked)
  if (!choiceSeparationEl) return null
  return choiceSeparationEl.value
}

function isUppercaseSelected() {
  const selectedRadio = Array.from(useMajuscules).find((radio) => radio.checked)
  if (!selectedRadio) return false
  else if (selectedRadio.value === false) return false
  else return true
}

/**
 *
 * @returns {null|string}
 */
function addSpecialChar() {
  let selectedChar = null
  useSpecialCharRadios.forEach(item => {
    if (item.checked) {
      selectedChar = item.value
    }
  })

  return selectedChar
}

function addUppercases(word) {
  if (!word) return
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function copyToClipBoard() {
  navigator.clipboard.writeText(inputShowNewPasswordEl.value)
}

function removeAccents(str) {
  if (!str) return
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * show new password in the dedicated input
 * @returns {Promise<void>}
 */
async function showNewPassword() {
  try {
    // Ensure wordsList is populated before using it

    await prepareData() // Fetch and populate wordsList
    // Display password in the dedicated element
    inputShowNewPasswordEl.value = await generateNewPassword()
  } catch (error) {
    console.error('Error generating password:', error)
  }
}

async function generateNewPassword() {

  const nbreMotsElt = document.querySelector('[name=nbre_mots]')
  const nbreMotsMaxValue = parseInt(nbreMotsElt.value, 10) || 3 // Default to 3 words if input is invalid
  const newWords = new Set()

  await prepareData() // Ensure wordsList is populated

  do {
    const word = wordsList[randomIntByMax(wordsList.length)]
    if (word) {
      newWords.add(word)
    }
  } while (newWords.size < nbreMotsMaxValue)

  const newWordsArray = Array.from(newWords)

  const newWordsTransformed = newWordsArray.map((word) => {
    let transformedWord = removeAccents(word)
    if (isUppercaseSelected()) {
      transformedWord = addUppercases(transformedWord)
    }
    return transformedWord
  })

  let newWordsSepared = newWordsTransformed.join(getSeparation() ?? '')

  const selectedChar = addSpecialChar()
  if (selectedChar) {
    const positionSpecialChar = randomIntByMax(newWordsSepared.length - 1)
    newWordsSepared = newWordsSepared.slice(0, positionSpecialChar).concat(selectedChar, newWordsSepared.slice(positionSpecialChar))
  }
  return newWordsSepared
}

/**
 * Fetches words and fills the wordsList array
 * @returns {Promise<void>}
 */
async function prepareData() {
  try {
    const response = await fetch('words.js') // Ensure it's a JSON file
    if (!response.ok) throw new Error(response.statusText)

    const words = await response.json() // Parse JSON response

    resetWordsList()

    for (let i = 0; i < wordsList.length; i++) {
      let newIndex = randomIntByMax(34000)
      // Ensure wordsList is filled with valid words
      if (words[newIndex] && !words[newIndex].includes('-')) {
        wordsList.push(words[newIndex])
      }
    }
  } catch (error) {
    const simpleWordsList = getWordsList()
    wordsList = [...simpleWordsList]
  }
}

function resetWordsList() {
  wordsList.length = 0
  wordsList.length = 100
}

/**
 * @returns {string[]}
 */
function getWordsList() {
  return [
    'drap',
    'collier',
    'chien',
    'arbre',
    'anticonstitutionnellement',
    'mensonge',
    'ministre'
  ]
}
