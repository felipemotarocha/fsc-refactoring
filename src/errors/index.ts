export class InvalidNameError extends Error {
  constructor() {
    super("Invalid name");
  }
}

export class InvalidEmailError extends Error {
  constructor() {
    super("Invalid e-mail");
  }
}
