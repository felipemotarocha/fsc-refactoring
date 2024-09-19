import { faker } from "@faker-js/faker";
import {
  Booking,
  BookingResource,
  BookingService,
} from "../src/layers/application/main";
import { InvalidEmailError, InvalidNameError } from "../src/errors";

// Resource Port
class BookingMemoryResource implements BookingResource {
  bookings: Booking[] = [];

  async getByRoomAndDate(roomId: string, date: string) {
    const booking = this.bookings.find(
      (booking) => booking.roomId === roomId && booking.date === date
    );
    return booking ?? null;
  }

  async create(booking: Booking) {
    this.bookings.push(booking);
  }
}

test("Deve lançar um erro caso o nome seja inválido", async () => {
  const bookingService = new BookingService(new BookingMemoryResource());
  const input = {
    name: "a",
    email: faker.internet.email(),
    date: faker.date.recent().toISOString(),
    roomId: faker.string.uuid(),
    guestName: faker.person.firstName(),
    guestEmail: faker.internet.email(),
  };
  const outputPromise = bookingService.create(input);
  await expect(outputPromise).rejects.toThrow(new InvalidNameError());
});

test("Deve lançar um erro caso o e-mail seja inválido", async () => {
  const bookingService = new BookingService(new BookingMemoryResource());
  const input = {
    name: "John Doe",
    date: "2022-12-31",
    roomId: faker.string.uuid(),
    guestName: "John Doe",
    guestEmail: "a",
  };
  const outputPromise = bookingService.create(input);
  await expect(outputPromise).rejects.toThrow(new InvalidEmailError());
});
