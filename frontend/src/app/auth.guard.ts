import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

// Simple JWT check from localStorage
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    // If no token, redirect to login
    return router.parseUrl('/login');
  }
  // Optionally, check token expiry here
  return true;
};
