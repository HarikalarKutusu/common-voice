import {
  ERR_NO_ABBREVIATIONS,
  ERR_NO_NUMBERS,
  ERR_NO_SYMBOLS,
  ERR_OTHER,
  ERR_TOO_LONG,
  ERR_NO_FOREIGN_SCRIPT,
  ValidatorRule,
} from '../../types'

const tokenizeWords = require('talisman/tokenizers/words')

// The values below are reflecting the new 15 sec recording duration (March 2024)
// As we already have many shorter sentences, we ask for longer ones.

// Minimum/Maximum words requested.
// Turkish is an agglutinative language, can have very long words and high variance in word length
// So we try to rely less on Word Count
const MIN_WORDS = 3 // we don't want very short sentences
const MAX_WORDS = 35 // we mainly want to limit the length via # of characters, so this is relaxed.
// Minimum/Maximum no of characters in a sentence (inc. spaces and punctuoation).
const MIN_LENGTH = 20 // we don't want very short sentences
const MAX_LENGTH = 170 // Max characters

// The following are based on our work in cv-sentence-extractor
// See: https://github.com/common-voice/cv-sentence-extractor/blob/main/src/rules/tr.toml
// Also, some are taken from Hebrew validators (see he.ts in this directory)

// Symbol definitions

const VALID_SYMBOLS = {
  // Turkish Alphabet. No words should start with "Ğ" (capital "ğ")
  alphabet: 'abcçdefgğhıijklmnoöprsştuüvyzABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZ',
  // âîûÂÎÛ - Extra diacritics for words borrowed from Arabic/Farsi
  // xwXW - These exist in borrowed/proper names from English, Kurdish, etc
  alphabet_extras: 'âîûxwÂÎÛXW',
  // Sentence ending
  punctuation: '-!"\',.:;?`…',
  // Other unicode punctuation alikes
  dashes: '\u2010-\u2015\ufe58\ufe63',
  quotes: '\u2018-\u201f\u2039\u203a\u2e42\u301d\u00bb\u00ab',
  // eslint-disable-next-line no-irregular-whitespace
  whitespace: ' \u00a0\u1680\u2000-\u200a\u202f\u205f\u3000',
}

const INVALID_SYMBOLS = {
  unwanted: '\r\n\t',
  symbols: '<>+*#@%^/\\(){}[]$&=_',
}

const ABBR_PATTERNS = {
  // for ABD, TSE, and similar
  pattern_1: '[A-ZÇĞİŞÖÜÂÎÛ]{2,}',
  // A.B.D, T.B.M.M. and similar
  pattern_2: '([A-ZÇĞİŞÖÜÂÎÛ]+.+){2,}',
  // for SaaS, LotR, and similar
  pattern_3: '[A-ZÇĞİŞÖÜÂÎÛ]+[a-zçğıöüşâîû]+[A-ZÇĞİŞÖÜÂÎÛ]+',
}

const OTHER_INVALID_PATTERNS = {
  // Mixed case e.g. "aBc"
  pattern_1: '[a-zçğıöüşâîû]+[A-ZÇĞİŞÖÜÂÎÛ]+[a-zçğıöüşâîû]+',
  // Single char words do not exist in Turkish
  pattern_2: '[A-ZÇĞİŞÖÜÂÎÛa-zçğıöüşâîû]{1}',
  // /\s{2,}|[,;!?.][,;!?]|[,;!?][,;!?.]/,
  pattern_3: 's{2,}|[,;!?.][,;!?]|[,;!?][,;!?.]',
}

// Regex definitions

// This prevents some quirks. A sentence should be a one liner, without tabs
const INVALID_SYMBOLS_REGEX = new RegExp(
  '[' + INVALID_SYMBOLS.unwanted + INVALID_SYMBOLS.symbols + ']',
  'u'
)

// Only allowed characters
const NOT_IN_ALLOWED_REGEX = new RegExp(
  '[^' +
    VALID_SYMBOLS.alphabet +
    VALID_SYMBOLS.alphabet_extras +
    VALID_SYMBOLS.punctuation +
    VALID_SYMBOLS.whitespace +
    VALID_SYMBOLS.dashes +
    VALID_SYMBOLS.quotes +
    ']',
  'u'
)

// All possible abbreviations
const ABBR_REGEX = new RegExp(
  '[' +
    ABBR_PATTERNS.pattern_1 +
    '|' +
    ABBR_PATTERNS.pattern_2 +
    '|' +
    ABBR_PATTERNS.pattern_3 +
    ']',
  'u'
)

// All possible abbreviations
const OTHER_INVALID_REGEX = new RegExp(
  '[' +
    OTHER_INVALID_PATTERNS.pattern_1 +
    '|' +
    OTHER_INVALID_PATTERNS.pattern_2 +
    '|' +
    OTHER_INVALID_PATTERNS.pattern_3 +
    ']',
  'u'
)

const INVALIDATIONS: ValidatorRule[] = [
  // digits
  {
    type: 'regex',
    regex: /[0-9]+/,
    // Original: 'Sentence should not contain numbers'
    // Translation: 'Sentence should not contain digits, ex: "200" should be written as "two hundred".
    error: 'Cümle rakam içermemeli, ör. "200": "iki yüz" olarak yazılmalı.',
    errorType: ERR_NO_NUMBERS,
  },
  // invalid symbol
  {
    type: 'regex',
    // Original: 'Sentence should not contain symbols'
    // Translation: 'The sentence should contain invisible and/or special symbols or brackets',
    regex: INVALID_SYMBOLS_REGEX,
    error: 'Cümle görünmeyen ve/veya özel karakterler, parantezler içermemeli',
    errorType: ERR_NO_SYMBOLS,
  },
  // Abbreviations
  {
    type: 'regex',
    regex: ABBR_REGEX,
    // Original: 'Sentence should not contain abbreviations'
    // Translation: `Sentence should not contain abbreviation`,
    error: 'Cümle kısaltmalar içermemelidir',
    errorType: ERR_NO_ABBREVIATIONS,
  },
  // Other cases
  {
    type: 'regex',
    regex: OTHER_INVALID_REGEX,
    // Translation: `The sentence cannot contain single letter words, words in format "aBc", or consequitive spaces or punctuation`,
    error:
      'Cümlede tek harfli ve "aBc" tarzında yazılmış kelimeler, ardışık boşluk ve noktalama işaretleri olamaz',
    errorType: ERR_OTHER,
  },
  // Word count
  {
    type: 'fn',
    fn: (sentence: string) => {
      const words = tokenizeWords(sentence)
      return words.length < MIN_WORDS || words.length > MAX_WORDS
    },
    // error: `Number of words must be between ${MIN_WORDS} and ${MAX_WORDS} (inclusive)`,
    // Translation: `Number of words must be minimum ${MIN_WORDS}, maximum ${MAX_WORDS}`,
    error: `Kelime sayısı en az ${MIN_WORDS}, en çok ${MAX_WORDS} olmalıdır`,
    errorType: ERR_TOO_LONG,
  },
  // Sentence length
  {
    type: 'fn',
    fn: (sentence: string) => {
      return sentence.length < MIN_LENGTH || sentence.length > MAX_LENGTH
    },
    // Translation: `Sentence length must be minimum ${MIN_LENGTH}, maximum ${MAX_LENGTH}.`,
    error: `Cümle uzunluğu en az ${MIN_LENGTH}, en çok ${MAX_LENGTH} olmalıdır`,
    errorType: ERR_TOO_LONG,
  },
  // Only alphabet & allowed symbols
  {
    type: 'regex',
    // error: 'Sentence should not contain symbols',
    // Translation: 'The sentence should only include letters from the extended Turkish alphabet (+hatted and xw) and punctuation',
    regex: NOT_IN_ALLOWED_REGEX,
    error:
      'Cümle sadece genişletilmiş Türkçe alfabede olan harfler (+şapkalar ve xw) ve noktalama işaretleri içerebilir',
    errorType: ERR_NO_FOREIGN_SCRIPT,
  },
]

export default INVALIDATIONS
