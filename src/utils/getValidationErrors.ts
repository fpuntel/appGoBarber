import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // [key] pode ser qualquer coisa
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  // No inner que recebe como parâmetro é recebido
  // um array com várias propriedades dos campos que
  // deram error no formulário.
  // Para cada error que será retornado será criado
  // uma propriedade na interface que irá receber o
  // error.
  err.inner.forEach((error) => { // eslint-disable-line
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
