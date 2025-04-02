const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const SECRET_KEY = "l2exCMTKWB";

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

const resolvers = {
  Query: {
    login: async (parent, args) => {
      const usernameOrEmail = args.usernameOrEmail.toLowerCase();
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return token;
    },
    searchEmployeeById: (parent, args) => {
      return Employee.findById(args.eid);
    },
    searchEmployeeByDesignationOrDepartment: (parent, args) => {
      return Employee.find({
        $or: [
          { designation: args.designation },
          { department: args.department },
        ],
      });
    },
    getAllEmployees: () => {
      return Employee.find({});
    },
  },
  Mutation: {
    signup: async (parent, args) => {
      const username = args.username.toLowerCase();
      const email = args.email.toLowerCase();
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (existingUser) {
        throw new Error("Username or email already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
        created_at: new Date(),
      });
      await user.save();
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return token;
    },
    addEmployee: async (parent, args) => {
      const existingEmployee = await Employee.findOne({ email: args.email });
      if (existingEmployee) {
        throw new Error("Employee's email already exists");
      }
      let employee = new Employee({
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        gender: args.gender,
        designation: args.designation,
        salary: args.salary,
        date_of_joining: args.date_of_joining,
        department: args.department,
        employee_photo: args.employee_photo,
        created_at: new Date(),
      });
      return employee.save();
    },
    updateEmployeeById: (parent, args) => {
      return Employee.findByIdAndUpdate(
        args.eid,
        {
          first_name: args.first_name,
          last_name: args.last_name,
          email: args.email,
          gender: args.gender,
          designation: args.designation,
          salary: args.salary,
          date_of_joining: args.date_of_joining,
          department: args.department,
          employee_photo: args.employee_photo,
          updated_at: new Date(),
        },
        { new: true }
      );
    },
    deleteEmployeeById: async (parent, args) => {
      try {
        // Find the employee by ID
        const employee = await Employee.findById(args.eid);

        if (!employee) {
          throw new Error("Employee not found");
        }

        // Delete the associated photo file if it exists
        if (employee.employee_photo) {
          const photoPath = path.join(__dirname, "..", employee.employee_photo); // Correctly resolve the path
          deleteFile(photoPath);
        }

        // Delete the employee record
        await Employee.findByIdAndDelete(args.eid);

        return "Employee deleted successfully";
      } catch (error) {
        console.error("Error deleting employee:", error);
        throw new Error("Failed to delete employee");
      }
    },
  },
};

module.exports = resolvers;