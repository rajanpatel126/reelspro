import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

function middleware() {
  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const pathName = req.nextUrl;

      // allowed paths
      if (
        pathName.pathname.startsWith("/api/auth") ||
        pathName.pathname.startsWith("/login") ||
        pathName.pathname.startsWith("/register")
      ) {
        return true;
      }

      // public urls
      if (
        pathName.pathname === "/" ||
        pathName.pathname.startsWith("/api/videos")
      ) {
        return true;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
