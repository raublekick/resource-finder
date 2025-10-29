export function useSearch(collection: any[], text: string) {
  return collection.filter(function (object: object) {
    const search = deepSearch(object, text.toLowerCase())
    return Object.keys(search).length > 0
  })
}

function deepSearch(collection: any, predicate: any, thisArg?: any) {
  if (typeof predicate === 'function') {
    predicate = predicate.bind(thisArg)
  } else {
    let keys = Array.isArray(arguments[1]) ? arguments[1].flat() : arguments[1]
    if (typeof keys === 'string') {
      keys = keys.toLowerCase()
    }
    predicate = function (val: any) {
      if (typeof val === 'string') {
        val = val.toLowerCase()
      }
      if (typeof val === 'number') {
        val = val.toString().toLowerCase()
      }
      if (typeof val === 'boolean') {
        val = val.toString().toLowerCase()
      }
      return typeof val === 'string' && val.includes(keys)
    }
  }
  
  const isArray = Array.isArray(collection)
  const result: any = isArray ? [] : {}
  
  for (const key in collection) {
    if (!collection.hasOwnProperty(key)) continue
    
    const val = collection[key]
    let include = predicate(val, key)
    
    if (!include && typeof val === 'object' && val !== null) {
      const deepResult = deepSearch(val, predicate)
      include = Object.keys(deepResult).length > 0 || (Array.isArray(deepResult) && deepResult.length > 0)
      if (include) {
        isArray ? result.push(deepResult) : (result[key] = deepResult)
        continue
      }
    }
    
    if (include) {
      isArray ? result.push(val) : (result[key] = val)
    }
  }
  
  return result
}

export function useMultiFieldFilter(
  collection: any[],
  predicate: string,
  fields: string[] | string
) {
  const results = collection.filter((item: Record<string, any>) => {
    let combinedPhrase = ''
    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        combinedPhrase += item[field] + ' '
      })
    } else {
      combinedPhrase = item[fields]
    }
    return combinedPhrase.toLowerCase().includes(predicate.toLowerCase())
  })
  return results
}

export function useMultiFieldDeepFilter(
  collection: any[],
  predicate: string,
  fields: string[] | string
) {
  const lowerCasePredicate = predicate.toLowerCase()

  const searchInItem = (item: any, fields: string[] | string): boolean => {
    let combinedPhrase = ''

    const processField = (value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // Process each element in the array (which can be an object)
          value.forEach((subItem) => processField(subItem))
        } else {
          // Process object by looking at its values
          Object.values(value).forEach((subValue) => processField(subValue))
        }
      } else {
        combinedPhrase += value + ' '
      }
    }

    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        const value = getNestedValue(item, field)
        processField(value)
      })
    } else {
      const value = getNestedValue(item, fields)
      processField(value)
    }

    return combinedPhrase.toLowerCase().includes(lowerCasePredicate)
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  return collection.filter((item) => searchInItem(item, fields))
}
