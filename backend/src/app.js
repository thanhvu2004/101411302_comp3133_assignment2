const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schemas/employeeSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://root:passW0rd@mycluster.i14yy.mongodb.net/comp3133_101411302_assigment1?retryWrites=true&w=majority&appName=MyCluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});
const upload = multer({ storage });

// Function to Delete a File
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

// REST API Endpoint for File Upload
app.post("/upload", upload.single("employee_photo"), async (req, res) => {
  const employeeId = req.body.employeeId; // Pass employeeId in the request body if editing
  let oldPhotoPath = null;

  if (employeeId) {
    try {
      // Fetch the old photo path from the database
      const employee = await mongoose.connection.db
        .collection("employees")
        .findOne({ _id: new mongoose.Types.ObjectId(employeeId) });

      if (employee && employee.employee_photo) {
        oldPhotoPath = path.resolve(__dirname, `.${employee.employee_photo}`);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      return res.status(500).json({ error: "Failed to fetch employee data" });
    }
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const newFilePath = `/uploads/${req.file.filename}`;

  // Delete the old photo if it exists
  if (oldPhotoPath) {
    deleteFile(oldPhotoPath);
  }

  res.status(200).json({ filePath: newFilePath });
});

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
