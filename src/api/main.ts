import crypto from "crypto";
import express from "express";
import { Client } from "pg";
import { InvalidEmailError, InvalidNameError } from "../errors";
import * as utils from "../utils";

const app = express();
app.use(express.json());

const client = new Client({
  user: "postgres",
  host: "localhost",
  password: "password",
  port: 5432,
});

client.connect();

app.post("/booking", async function (req, res) {
  try {
    const bookingId = crypto.randomUUID();
    const [existingBooking] = (
      await client.query(
        "SELECT * FROM bookings WHERE room_id = $1 AND date = $2",
        [req.body.roomId, req.body.date]
      )
    ).rows;
    if (existingBooking) {
      return res.status(422).send("Booking already exists.");
    }
    if (!utils.isNameValid(req.body.guestName)) {
      throw new InvalidNameError();
    }
    if (!utils.isEmailValid(req.body.guestEmail)) {
      throw new InvalidEmailError();
    }
    if (!utils.isDateValid(req.body.date)) {
      return res.status(500).send("Internal server error");
    }
    await client.query(
      "INSERT INTO bookings (booking_id, guest_name, guest_email, room_id, date) VALUES ($1, $2, $3, $4, $5)",
      [
        bookingId,
        req.body.guestName,
        req.body.guestEmail,
        req.body.roomId,
        req.body.date,
      ]
    );

    return res.status(200).json({
      bookingId: bookingId,
      message: "Booking confirmed!",
    });
  } catch (error) {
    if (
      error instanceof InvalidNameError ||
      error instanceof InvalidEmailError
    ) {
      return res.status(422).send(error?.message);
    }
    console.error("Error processing booking:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
