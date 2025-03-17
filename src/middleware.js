import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "d1713175-6f0e-4388-8286-4ef20eb7ed66");

  // Create a new URL object instead of modifying request.nextUrl
  const destinationUrl = new URL(`https://www.create.xyz${request.nextUrl.pathname}`);

  return NextResponse.rewrite(destinationUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
