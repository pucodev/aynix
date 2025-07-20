export interface OptionValidate {
  value: string | number | undefined
  onFailed?: Function
  validators: {
    custom?: {
      validate: Function
      message: string
    }
    numeric?: {
      message: string
    }
    email?: {
      message: string
    }
    between?: {
      message: string
      inclusive?: boolean
      max: number
      min: number
    }
    required?: {
      message: string
    }
  }
}

class Validate {
  errors: string[]

  constructor(options: OptionValidate[]) {
    this.errors = []

    if (options) {
      this.validate(options)
    }
  }

  validate(options: OptionValidate[]) {
    if (typeof options === 'object' && !(options instanceof Array)) {
      options = [options]
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const value = option.value
      const validators = option.validators
      let validator
      let isValid = true

      // ************
      // CUSTOM
      // ************
      if (
        validators.custom &&
        typeof validators.custom.validate === 'function'
      ) {
        if (!validators.custom.validate(value)) {
          this.addError(validators.custom.message || '')
          isValid = false
        }
      }

      // ************
      // NUMBER
      // ************
      else if (validators.numeric) {
        if (typeof value !== 'number' || isNaN(value)) {
          this.addError(validators.numeric?.message || '')
          isValid = false
        }
      }

      // ************
      // EMAIL
      // ************
      else if (validators.email) {
        const regexEmail =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (typeof value === 'string' && !regexEmail.test(value.trim())) {
          this.addError(validators.email.message || '')
          isValid = false
        }
      }

      // ************
      // BETWEEN
      // ************
      else if (validators.between) {
        validator = validators.between
        // fields: inclusive, min, max, message
        const message = validator?.message || ''
        const vNumber = Number(value)
        if (
          validator?.inclusive &&
          !(vNumber <= validator?.max && vNumber >= validator?.min)
        ) {
          this.addError(message)
          isValid = false
        } else if (
          !validator?.inclusive &&
          !(vNumber < validator?.max && vNumber > validator?.min)
        ) {
          this.addError(message)
          isValid = false
        }
      }

      // ************
      // REQUIRED
      // ************
      else if (
        validators.required &&
        (value === '' || typeof value === 'undefined' || value === null)
      ) {
        this.addError(validators.required?.message || '')
        isValid = false
      }

      // On failed
      if (!isValid && typeof option.onFailed === 'function') {
        option.onFailed()
      }
    }
  }

  isValid() {
    return this.errors.length == 0
  }

  concat(validate: { errors: string[] }) {
    this.errors = this.errors.concat(validate.errors)
  }

  addError(error: string) {
    this.errors.push(error)
  }

  getErrors() {
    return this.errors
  }

  getStrErrors() {
    return `Completa correctamente los siguientes campos: ${this.getRawStrErrors()}`
  }

  getRawStrErrors() {
    return this.errors.join(', ')
  }
}

export default Validate
