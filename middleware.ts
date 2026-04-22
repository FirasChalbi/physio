import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Only protect /admin/* and /account/*
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/account")) {
    return NextResponse.next()
  }

  // /admin/* — require admin or merchant role
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const role = (session.user as any).role
    if (role !== "admin" && role !== "merchant") {
      return NextResponse.redirect(new URL("/account", req.url))
    }
  }

  // /account — require login
  if (pathname.startsWith("/account")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
