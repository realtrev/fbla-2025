const guestOnlyRoutes = ['/', '/login', '/register_student', '/register_business', '/login/school', '/login/organization'];

const schoolAdminOnlyRoutes = ['/admin/s/dashboard'];

const organizationAdminOnlyRoutes = ['/admin/o/dashboard', '/admin/o/messages', '/admin/o/listings'];

const allowRouteAccess = (targetRoute: string, userIsAuthenticated: boolean, accountType?: string) => {
  // if target route starts with /app, check if user is authenticated
  if (!userIsAuthenticated) {
    if (guestOnlyRoutes.includes(targetRoute)) {
      return targetRoute;
    }

    if (targetRoute.startsWith('/admin/o')){
      return '/login/organization';
    }
    if (targetRoute.startsWith('/admin/s')) {
      return '/login/school';
    }
    return '/login';
  }

  if (targetRoute === '/api/logout') {
    return targetRoute;
  }

  if (!organizationAdminOnlyRoutes.map((route) => targetRoute.startsWith(route)).some((t) => t == true) && accountType === 'organizationAdmin') {
    return '/admin/o/dashboard';
  }

  if (!schoolAdminOnlyRoutes.map((route) => targetRoute.startsWith(route)).some((t) => t == true) && accountType === 'schoolAdmin') {
    return '/admin/s/dashboard';
  }

  // if target route is in guest only routes, check if user is authenticated
  if (guestOnlyRoutes.includes(targetRoute) && userIsAuthenticated) {
    if (accountType === 'student') {
      return '/dashboard';
    } else if (accountType === 'organizationAdmin') {
      return '/admin/o/dashboard';
    } else if (accountType === 'schoolAdmin') {
      return '/admin/s/dashboard';
    }
  }

  return targetRoute;
}

export { allowRouteAccess };