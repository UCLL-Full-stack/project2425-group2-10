import { createUser, findUserByEmail } from "../repository/userRepository";
import { adminRepository } from "../repository/adminRepository";

async function test() {
  console.log("Testing User Repository...");
  const user = await createUser({
    email: "admin@test.com",
    password: "securepassword",
    role: "admin",
  });
  console.log("Created User:", user);

  const foundUser = await findUserByEmail("admin@test.com");
  console.log("Found User by Email:", foundUser);

  console.log("Testing Admin Repository...");
  const admin = adminRepository.addAdmin({
    email: "admin@test.com",
    password: "securepassword",
    role: "admin",
  });
  console.log("Added Admin:", admin);

  const allAdmins = adminRepository.getAllAdmins();
  console.log("All Admins:", allAdmins);
}

test();