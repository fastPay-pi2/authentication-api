const productSchema = {
  name: {
    isString: true,
    errorMessage: 'invalid name'
  },
  image: {
    isString: true,
    errorMessage: 'invalid image'
  },
  price: {
    isFloat: true,
    errorMessage: 'invalid price'
  }
}

const itemSchema = {
  rfid: {
    isInt: true,
    errorMessage: 'invalid rfid'
  },
  expirationDate: {
    isString: true,
    errorMessage: 'invalid date'
  },
  idProduct: {
    isInt: true,
    errorMessage: 'invalid product'
  }
}

const productSchemaPut = {
  name: {
    isString: true,
    optional: true,
    errorMessage: 'invalid name'
  },
  image: {
    isString: true,
    optional: true,
    errorMessage: 'invalid image'
  },
  price: {
    isFloat: true,
    optional: true,
    errorMessage: 'invalid price'
  }
}

const itemSchemaPut = {
  rfid: {
    isInt: true,
    optional: true,
    errorMessage: 'invalid rfid'
  },
  expirationDate: {
    isString: true,
    optional: true,
    errorMessage: 'invalid date'
  },
  idProduct: {
    isInt: true,
    errorMessage: 'invalid product'
  }
}

module.exports = {
  productSchema,
  itemSchema,
  productSchemaPut,
  itemSchemaPut
}
