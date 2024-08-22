import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  password: "password",
  port: 5432,
});

async function setupDatabase() {
  try {
    await client.connect();

    // Create bookings table
    await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                booking_id UUID PRIMARY KEY,
                guest_name VARCHAR(100) NOT NULL,
                guest_email VARCHAR(100) NOT NULL,
                room_id VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                UNIQUE (room_id, date)
            );
        `);

    console.log("Bookings table created successfully.");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    await client.end();
  }
}

setupDatabase();
