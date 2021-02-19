import { FormBuilder, SearchFormBuilder } from './Builder'
import { InputPassword, RTimeInput, TimeInput } from './Component'
import { StepForm } from './Step/index'

const createFormBuilder = function (builder, options = {}) {
  return {
    ...builder,
    ...options
  }
}

export {
  FormBuilder,
  SearchFormBuilder,
  createFormBuilder,

  InputPassword,
  RTimeInput,
  TimeInput,

  StepForm
}
