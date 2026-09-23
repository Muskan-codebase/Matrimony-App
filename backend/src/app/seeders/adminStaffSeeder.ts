import bcrypt from "bcrypt";
import Auth from "../modules/auth/auth.model";
import { UserRole } from "../modules/auth/auth.interface";

export const seedAdmin = async () => {

    const existingAdmin = await Auth.findOne({
        email: "admin@matrimony.com",
        role: UserRole.ADMIN,
    });

    if (existingAdmin) {
        console.log("Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Auth.create({
        email: "admin@matrimony.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true,
        loginCount: 0,
        isDeleted: false,
    });

    console.log("Default admin created.");
};