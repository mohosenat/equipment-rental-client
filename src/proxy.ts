import { NextRequest, NextResponse } from "next/server";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

const roleRoutes = [
  {
    role: "admin",
    routes: [
      "/admin/equipment",
      "/admin/profile",
      "/admin/rentals",
      "/admin/users",
    ],
  },
  {
    role: "owner",
    routes: [
      "/owner/add-equipment",
      "/owner/my-equipment",
      "/owner/profile",
      "/owner/rentals",
    ],
  },
  {
    role: "customer",
    routes: ["/favorites", "/rentals", "/profile"],
  },
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Equipment listing remains public, but equipment details require login.
  const isEquipmentDetails =
    pathname.startsWith("/equipment/") && pathname !== "/equipment";

  const matchedRoleRoute = roleRoutes.find((group) =>
    group.routes.some((route) => matchesRoute(pathname, route)),
  );

  // No authentication required for other public routes.
  if (!isEquipmentDetails && !matchedRoleRoute) {
    return NextResponse.next();
  }

  const cookie = request.headers.get("cookie");

  if (!cookie || !AUTH_URL) {
    return redirectToLogin(request);
  }

  try {
    const response = await fetch(
      `${AUTH_URL.replace(/\/$/, "")}/api/auth/get-session`,
      {
        method: "GET",
        headers: {
          cookie,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return redirectToLogin(request);
    }

    const session = await response.json();

    if (!session?.user) {
      return redirectToLogin(request);
    }

    // Details page requires login, but allows all authenticated roles.
    if (isEquipmentDetails) {
      return NextResponse.next();
    }

    const userRole = session.user.role?.toLowerCase();

    if (userRole !== matchedRoleRoute?.role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set(
    "callbackURL",
    request.nextUrl.pathname + request.nextUrl.search,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/favorites/:path*",
    "/rentals/:path*",
    "/profile/:path*",
    "/equipment/:path*",
  ],
};
