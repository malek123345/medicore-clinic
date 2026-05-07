import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService), router = inject(Router);
  const allowed: UserRole[] = route.data['roles'] ?? [];
  const user = auth.user();
  if (!user) { router.navigate(['/login']); return false; }
  if (!allowed.length || allowed.includes(user.role)) return true;
  router.navigate([auth.getDashboardRoute()]); return false;
};