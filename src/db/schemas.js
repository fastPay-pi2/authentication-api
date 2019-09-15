const administratorSchema = {
  cpf: {
    isString: true,
    errorMessage: 'invalid cpf'
  },
  password: {
    isString: true,
    errorMessage: 'invalid password'
  },
  name: {
    isString: true,
    errorMessage: 'invalid name'
  },
  phoneNumber: {
    isString: true,
    errorMessage: 'invalid phoneNumber'
  },
  birthday: {
    isString: true,
    errorMessage: 'invalid birthday'
  },
  email: {
    isString: true,
    errorMessage: 'invalid email'
  },
  image: {
    isString: true,
    errorMessage: 'invalid image'
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
  administratorSchema,
  itemSchema,
  productSchemaPut,
  itemSchemaPut
}
