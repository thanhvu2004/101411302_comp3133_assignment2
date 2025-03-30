const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const User = require("../models/User");

const SECRET_KEY = "l2exCMTKWB";

const resolvers = {
  Query: {
    login: async (parent, args) => {
      const user = await User.findOne({
        $or: [
          { username: args.usernameOrEmail },
          { email: args.usernameOrEmail },
        ],
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
      const existingUser = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (existingUser) {
        throw new Error("Username or email already exists");
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const user = new User({
        username: args.username,
        email: args.email,
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
        },
        { new: true }
      );
    },
    deleteEmployeeById: (parent, args) => {
      return Employee.findByIdAndDelete(args.eid);
    },
  },
};

module.exports = resolvers;