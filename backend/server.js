const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: process.env.DB_SSL_CA,
        rejectUnauthorized: true
    }
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");
});

// Test backend
app.get("/", (req, res) => {
    res.send("Essensuals Salon Backend is running!");
});


const PORT = process.env.port || 5000;
app.post("/api/appointments", (req, res) => {
    const {
        name,
        phone,
        service,
        stylist,
        appointment_date,
        appointment_time
    } = req.body;

    const sql = `
        INSERT INTO appointments
        (name, phone, service, stylist, appointment_date, appointment_time)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            phone,
            service,
            stylist,
            appointment_date,
            appointment_time
        ],
        (err, result) => {
            if (err) {
                console.error("Booking error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to save appointment"
                });
            }

            res.json({
                success: true,
                message: "Appointment booked successfully",
                appointmentId: result.insertId
            });
        }
    );
});
// Get all appointments
app.get("/api/appointments", (req, res) => {
  const sql = `
    SELECT *
    FROM appointments
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch appointments error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch appointments"
      });
    }

    res.json({
      success: true,
      appointments: results
    });
  });
});
// Update appointment status
app.put("/api/appointments/:id/status", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const sql = "UPDATE appointments SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Status update error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update status"
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully"
    });
  });
});
// Delete appointment
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM appointments WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete appointment"
      });
    }

    res.json({
      success: true,
      message: "Appointment deleted successfully"
    });
  });
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});