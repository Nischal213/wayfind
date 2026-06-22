import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, userAgent } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sso-callback(.*)',
  "/desktop-only",
])

export default clerkMiddleware(async (auth, request) => {
  const { device } = userAgent(request)
  const { userId } = await auth()

  if ((device.type === "mobile" || device.type === "tablet") && request.nextUrl.pathname !== '/desktop-only') {
    return NextResponse.redirect(new URL("/desktop-only", request.url))
  }

  if (device.type === undefined && request.nextUrl.pathname === "/desktop-only") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}