import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, take, tap } from "rxjs";
import { Response_realTimePrice } from "../stock/stock-models";
import { StockService } from "../stock/stock.service";

@Injectable({ providedIn: "root" })
export class MarketIndexGuard implements CanActivate {
  constructor(private stockService: StockService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const urlArray = state.url.split("/");
    const symbol: string = urlArray[2];

    // use the /quote api route to the real-time price can be used
    // to get the current index as well
    return this.stockService.getRealTimePrice(symbol).pipe(
      take(1),
      map<Response_realTimePrice[], boolean | UrlTree>((data) => {
        if (data.length === 0) {
          // if user enter any index directly, there won't any result for sure
          return this.router.createUrlTree([`/market-index`]);
        }
        return true;
      })
    );
  }
}
