const guestOnlyRoutes = ['/', '/login', '/register_student', '/register_business'];

const allowRouteAccess = (targetRoute: string, userIsAuthenticated: boolean) => {
  // if target route starts with /app, check if user is authenticated
  if (targetRoute.startsWith('/app') && !userIsAuthenticated) {
    return '/login';
  }

  // if target route is in guest only routes, check if user is authenticated
  if (guestOnlyRoutes.includes(targetRoute) && userIsAuthenticated) {
    return '/app';
  }

  return targetRoute;
}

export { allowRouteAccess };