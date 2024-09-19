// Data Access Object (DAO)

import { client } from "../../db";
import { BookingResource } from "../application/main";

export class BookingMemoryDAO implements BookingResource {
  bookings: {
    bookingId: string;
    roomId: string;
    date: string;
    guestName: string;
    guestEmail: string;
  }[] = [];

  constructor() {
    this.bookings = [];
  }

  async getByRoomAndDate(roomId: string, date: string) {
    const booking = this.bookings.find(
      (booking) => booking.roomId === roomId && booking.date === date
    );
    console.log({ bookings: this.bookings });
    return booking ?? null;
  }

  async create({
    bookingId,
    guestEmail,
    guestName,
    date,
    roomId,
  }: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    date: string;
    roomId: string;
  }) {
    this.bookings.push({
      bookingId,
      guestName,
      guestEmail,
      roomId,
      date,
    });
  }
}

// Resource Adapter
export class BookingDatabaseDAO implements BookingResource {
  async getByRoomAndDate(roomId: string, date: string) {
    const response = await client.query(
      "SELECT * FROM bookings WHERE room_id = $1 AND date = $2",
      [roomId, date]
    );
    if (response.rows.length === 0) {
      return null;
    }
    return {
      bookingId: response.rows[0].booking_id,
      roomId: response.rows[0].room_id,
      date: response.rows[0].date,
      guestName: response.rows[0].guest_name,
      guestEmail: response.rows[0].guest_email,
    };
  }

  async create({
    bookingId,
    guestEmail,
    guestName,
    date,
    roomId,
  }: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    date: string;
    roomId: string;
  }) {
    await client.query(
      "INSERT INTO bookings (booking_id, guest_name, guest_email, room_id, date) VALUES ($1, $2, $3, $4, $5)",
      [bookingId, guestName, guestEmail, roomId, date]
    );
  }
}
