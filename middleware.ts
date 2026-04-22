import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const token = req.auth

  // /admin/* — require admin or merchant role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const role = (token as any).user?.role
    if (role !== "admin" && role !== "merchant") {
      return NextResponse.redirect(new URL("/account", req.url))
    }
  }

  // /account — require login
  if (pathname.startsWith("/account")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
