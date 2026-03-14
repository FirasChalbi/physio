import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const token = req.auth

  // /admin/* — require admin or staff role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const role = (token as any).user?.role
    if (role !== "admin" && role !== "staff") {
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
