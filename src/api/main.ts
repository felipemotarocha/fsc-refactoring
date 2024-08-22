import crypto from "crypto";
import express from "express";
import { Client } from "pg";

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
  let result;
  try {
    const bookingId = crypto.randomUUID();

    const [existingBooking] = (
      await client.query(
        "SELECT * FROM bookings WHERE room_id = $1 AND date = $2",
        [req.body.roomId, req.body.date]
      )
    ).rows;

    if (existingBooking) {
      result = -6;
    } else {
      if (req.body.guestName.match(/^[a-zA-Z]+ [a-zA-Z]+$/)) {
        if (req.body.guestEmail.match(/^(.+)@(.+)$/)) {
          if (req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const date = new Date(req.body.date);
            const timestamp = date.getTime();

            if (
              typeof timestamp === "number" &&
              !Number.isNaN(timestamp) &&
              req.body.date === date.toISOString().split("T")[0]
            ) {
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

              const confirmation = {
                bookingId: bookingId,
                message: "Booking confirmed!",
              };
              result = confirmation;
            } else {
              // Invalid date
              result = -1;
            }
          } else {
            // Invalid date format
            result = -1;
          }
        } else {
          // Invalid email
          result = -2;
        }
      } else {
        // Invalid name
        result = -3;
      }
    }

    if (typeof result === "number") {
      res.status(422).send(result + "");
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
