import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { catchError, map, Observable, of, take } from "rxjs";

import { UserService } from "../user.service";

@Injectable({ providedIn: "root" })
export class UserGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.userService.checkAuth().pipe(
      take(1),
      map(({ hasAuth }) => {
        if (hasAuth) return this.router.createUrlTree(["/"]);
        return true;
      }),
      catchError((error: any) => {
        return of(true);
      })
    );
  }
}

/*

If user enter the /user/sign-in or /sign-up route directly, the "getUserInfo" might
not be resolved yet, the "hasAuth" will be false when the SignInComponent is loaded
Then after the "getUserInfo" is resolved, the SignInComponent will redirect user to
home page. Since the SignInComponent will be loaded and unmounted in a flash, this
will create a very ugly flashing screen effect

So I need to use the guard to check the auth directly before loading the
/user/sign-in or /sign-up route

This method is the same as the one I used in the auth guard for the portfolio route

*/
