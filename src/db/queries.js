const SELECT_ALL = tableName => {
  console.log('tablename = ', tableName)
  return 'SELECT * FROM ' + tableName + ';'
}

const UPDATE = (tableName, json, idField, id) => {
  // console.log(tableName +  column + id)
  const attributes = createUpdateString(json)
  return (
    'UPDATE ' +
    tableName +
    ' SET ' +
    attributes +
    ' WHERE ' +
    idField +
    ' = ' +
    id +
    ';'
  )
}

const REMOVE = (tableName, id, idField) => {
  // console.log(tableName +  column + id)
  return 'DELETE FROM ' + tableName + ' WHERE ' + idField + ' = ' + id + ';'
}

const SELECT_ONE = (tableName, id) => {
  let param = 'id'
  if (tableName === 'item') param = 'rfid'
  return 'SELECT * FROM ' + tableName + ' WHERE ' + param + ' = ' + id + ';'
}

const INSERT = (tableName, json) => {
  let attributes = Object.keys(json)
  attributes = '(' + attributes + ')'
  let values = Object.values(json)
  values = createString(values)

  // console.log(attributes)
  // console.log(values)

  return (
    'INSERT INTO ' + tableName + ' ' + attributes + ' VALUES ' + values + ';'
  )
}

const createUpdateString = json => {
  let str = ''
  for (const key in json) {
    str += ' ' + key + " = '" + json[key] + "'" + ','
  }
  str = str.substring(0, str.length - 1)
  return str
}

// creates string in SQL format to insert
const createString = array => {
  let str = '('
  let first = array[0]
  first = isFloat(first) ? first : "'" + first + "'"

  str += first
  array.shift()
  array.forEach(element => {
    if (!isFloat(element) || isDate(String(element))) {
      element = "'" + element + "'"
    }
    str += ', ' + element
  })
  str += ')'

  return str
}

const isFloat = str => {
  return !isNaN(parseFloat(str))
}

// TODO - verificação decente
const isDate = str => {
  return str.search('-') > 0
}

module.exports = {
  SELECT_ALL,
  SELECT_ONE,
  INSERT,
  UPDATE,
  REMOVE
}
