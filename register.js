const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:5500" }));
const upload = multer();
mongoose.connect("mongodb://127.0.0.1:27017/jobfinder")
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phoneNumber: Number,
  age: Number,
  gender: String,
  skills: String,
  experience:Number,
}, { versionKey: false });

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  company: String,
}, { versionKey: false });

const User = mongoose.model("User", userSchema);
const Recruiter = mongoose.model("Recruiter", recruiterSchema);

app.post("/post", upload.none(), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      skills:req.body.skills,
      experience: req.body.experience,
    });
    await userData.save()
    res.status(200).send("data submitted successfully");
  }
  catch(error)
  {
    console.error("error saving data to the database",error);
    res.status(500).send("internal server error");
  }
  });

  app.post("/register/recruiter", upload.none(), async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const recruiterData = new Recruiter({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        company: req.body.company,
      });
      await recruiterData.save()
      res.status(200).send("Data submitted successfully");
    } catch (error) {
      console.error("Error saving data to the database", error);
      res.status(500).send("Internal server error");
    }
  });
  
  app.post("/login", upload.none(), async (req, res) => {
    try {
      const { name, password } = req.body;
      console.log(`Login attempt for username: ${name}`);
      let user = await User.findOne({ name: name });
      let userType;
      if (!user) {
        user = await Recruiter.findOne({ name: name });
        userType = "recruiter";
    } else {
      userType = "user";
    }
      if (!user) {
        console.log("User not found");
        res.status(401).send("Invalid username or password");
      } else {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          const userType = user instanceof User ? "user" : "recruiter";
          res.status(200).json({ message: "Login successful", username: name,userType: userType });
        } else {
          console.log("Invalid password");
          res.status(401).send("Invalid username or password");
        }
      }
    }
   catch (error) {
      console.error("error logging in", error);
      res.status(500).send("internal server error");
    }
  });
  
  app.get('/skills/python', async (req, res) => {
    try {
      const users = await User.find({ skills: 'Python' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });
  
  app.get('/skills/java', async (req, res) => {
    try {
      const users = await User.find({ skills: 'Java' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

  app.get('/skills/javascript', async (req, res) => {
    try {
      const users = await User.find({ skills: 'JavaScript' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });
  
  app.get('/skills/html', async (req, res) => {
    try {
      const users = await User.find({ skills: 'HTML' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });
  
  app.get('/skills/css', async (req, res) => {
    try {
      const users = await User.find({ skills: 'CSS' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });
  
  app.get('/skills/c', async (req, res) => {
    try {
      const users = await User.find({ skills: 'C' }).sort({ experience: -1 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });

  
  app.listen(5000, () => {
    console.log("Server is running successfully ");
  });