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
export class AuthGuard implements CanActivate {
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
        console.log("hasAuth --- auth guard", hasAuth);
        if (hasAuth) return true;
        return this.router.createUrlTree(["/user/sign-in"]);
      }),
      catchError((error: any) => {
        console.log(error);
        return of(this.router.createUrlTree(["/user/sign-in"]));
      })
    );
  }
}
