export class BookingAlreadyExistsError extends Error {
  constructor() {
    super("Booking already exists.");
  }
}

export class InvalidDateError extends Error {
  constructor() {
    super("Invalid date");
  }
}
