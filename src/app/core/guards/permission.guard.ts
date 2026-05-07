import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user();
  const permission = route.data?.['permission'];

  // 👨‍⚕️ Doctor → accès total
  if (user?.role === 'Doctor') {
    return true;
  }

  // 👩‍💼 Secretary → حسب permission
  if (user?.role === 'Secretary') {
    if (user.permissions?.[permission as keyof typeof user.permissions]) {
      return true;
    }
    return router.createUrlTree(['/doctor/dashboard']);
  }

  // ❌ أي role آخر → login
  return router.createUrlTree(['/login']);
};