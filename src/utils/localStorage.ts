export const localStorageUtil = {
    get: <ReturnType>(key: string): ReturnType | undefined => {
      try {
        const storedValue = localStorage.getItem(key)
        if (!storedValue || typeof storedValue !== 'string') return
        return JSON.parse(storedValue) as ReturnType
      } catch (e) {
        return undefined
      }
    },
    set: <StoredValue extends object>(key: string, value: StoredValue) => {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
  }
  


  const randomSignsRegexp = /\\|[\!\@\#\$\%\^\&\+\=\?\¿\¡\~\°\§\<\>\*\/\|]/g

  /**
   * Adjusts case (lower), removes diacritics (normalize NFD), removes spaces, removes signs (comma, point, semicolon, colon, parenthesis, etc. ).
   * Based on https://medium.com/@ievgenii.shulitskyi/string-data-normalization-and-similarity-matching-algorithms-4b7b1734798e
   */
  export const normalizeString = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .replace(/\s+/g, '')
      .replace(/[\.\,\;\:]/g, '')
      .replace(/[\_\-]/g, '')
      .replace(/[\(\)\{\}\[\]]/g, '') // parenthesis and similars
      .replace(randomSignsRegexp, '') // random signs
  

export       const buildDate = ({ day, month, year }: { year: number; month?: number; day?: number }) =>
        new Date(`${month ?? 1}/${day ?? 1}/${year}`)
      