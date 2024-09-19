import { InvalidEmailError, InvalidNameError } from "../../errors";
import { isDateValid, isEmailValid, isNameValid } from "../../utils";
import { BookingAlreadyExistsError, InvalidDateError } from "./errors";

// Application (MAIS IMPORTANTE)

export interface Booking {
  bookingId: string;
  roomId: string;
  date: string;
  guestName: string;
  guestEmail: string;
}

// Resource Port
export interface BookingResource {
  getByRoomAndDate: (roomId: string, date: string) => Promise<Booking | null>;
  create: (params: {
    bookingId: string;
    roomId: string;
    date: string;
    guestName: string;
    guestEmail: string;
  }) => Promise<void>;
}

interface Input {
  roomId: string;
  date: string;
  guestName: string;
  guestEmail: string;
}

export class BookingService {
  constructor(readonly bookingResource: BookingResource) {}

  async create({ roomId, date, guestEmail, guestName }: Input) {
    const bookingId = crypto.randomUUID();
    const existingBooking = await this.bookingResource.getByRoomAndDate(
      roomId,
      date
    );
    if (existingBooking) {
      throw new BookingAlreadyExistsError();
    }
    if (!isNameValid(guestName)) {
      throw new InvalidNameError();
    }
    if (!isEmailValid(guestEmail)) {
      throw new InvalidEmailError();
    }
    if (!isDateValid(date)) {
      throw new InvalidDateError();
    }
    await this.bookingResource.create({
      bookingId: bookingId,
      roomId,
      date,
      guestEmail,
      guestName,
    });
    return { bookingId };
  }
}
