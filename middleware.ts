import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin/* and /account/*
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/account")) {
    return NextResponse.next()
  }

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  const token = await getToken({ req, secret, cookieName: "authjs.session-token" })

  // /admin/* — require admin or merchant role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const role = (token as any).role
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
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
