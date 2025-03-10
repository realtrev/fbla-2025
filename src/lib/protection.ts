const guestOnlyRoutes = ['/', '/login', '/register_student', '/register_business', '/login/school', '/login/organization', '/forgot_password'];

const schoolAdminOnlyRoutes = ['/admin/s/dashboard', '/admin/s/messages', '/admin/s/students', '/admin/s/applications', '/admin/s/listings'];

const organizationAdminOnlyRoutes = ['/admin/o/dashboard', '/admin/o/messages', '/admin/o/listings', '/admin/o/applications'];

const studentOnlyRoutes = ['/verify','/dashboard', '/dashboard/messages', '/dashboard/applications', '/jobs', '/messages', '/applications', '/profile'];

const anyAccess = ['/licenses','/terms','/about','/privacy', '/cookies', '/contact'];


const allowRouteAccess = (targetRoute: string, userIsAuthenticated: boolean, accountType?: string) => {
  // if target route starts with /app, check if user is authenticated
  if (anyAccess.includes(targetRoute) || targetRoute === "/") {
    return targetRoute;
  }

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

  if (!studentOnlyRoutes.map((route) => targetRoute.startsWith(route)).some((t) => t == true) && accountType === 'student') {
    return '/dashboard';
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