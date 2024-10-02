import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// ROUTES THAT CAN ONLY BE ACCESSED AFTER AUTHENTICATION
const protectedRoutes = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recordings',
  '/personal-room',
  '/meeting(.*)'
  // Add more routes here...
])

// Middleware for authenticating
export default clerkMiddleware((auth, req) => {
  if(protectedRoutes(req)) auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}