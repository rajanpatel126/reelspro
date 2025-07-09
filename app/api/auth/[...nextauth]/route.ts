import authOptions from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// This handler will handle both GET and POST requests for authentication
export { handler as GET, handler as POST };
