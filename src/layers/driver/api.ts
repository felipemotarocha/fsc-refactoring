import express from "express";
import { Client } from "pg";
import { InvalidEmailError, InvalidNameError } from "../../errors";
import { BookingService } from "../application/main";
import { BookingDatabaseDAO, BookingMemoryDAO } from "../resources/booking-dao";
import { client } from "../../db";
import {
  BookingAlreadyExistsError,
  InvalidDateError,
} from "../application/errors";

const app = express();
app.use(express.json());

client.connect();

// Driver (API)
app.post("/booking", async function (req, res) {
  try {
    const bookingService = new BookingService(new BookingMemoryDAO());
    const bookingId = await bookingService.create(req.body);
    return res.status(200).json({
      bookingId,
      message: "Booking confirmed!",
    });
  } catch (error) {
    if (
      error instanceof InvalidNameError ||
      error instanceof InvalidEmailError ||
      error instanceof BookingAlreadyExistsError ||
      error instanceof InvalidDateError
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
