require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const run = async () => {
  const email = process.argv[2] || "ps@gmail.com";

  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { role: "admin" } },
      { new: true }
    );

    if (!user) {
      console.error(`❌ User not found with email: ${email}`);
      console.log("Existing users in database:");
      const allUsers = await User.find({}, "fullName email role");
      console.log(allUsers);
    } else {
      console.log(`✅ Success! Updated user "${user.fullName}" (${user.email}) to role: "${user.role}"`);
    }
  } catch (err) {
    console.error("Error updating role:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
