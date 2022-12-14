import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";

import { AppState } from "../ngrx-store/app.reducer";
import { fetchAllChangePercentage } from "../stock/stock-state/stock.actions";
import { RealTimeIndex } from "./market-index-models";
import { MarketIndexService } from "./market-index.service";

@Injectable({ providedIn: "root" })
export class MarketIndexGuard implements CanActivate {
  constructor(
    private marketIndexService: MarketIndexService,
    private router: Router,
    private store: Store<AppState>
  ) {}

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
    // the "^DJI" symbol will be converted to "%5EDJI" if it was attached to
    // an url, and Spring (the server) webClient somehow cannot fetch any data
    // using this format "%5EDJI". I have to convert the symbol back
    // to "^DJI" format before making the request below
    const _symbol = "^" + symbol.slice(3);

    // use the /quote api route to the real-time price can be used
    // to get the current index as well
    return this.marketIndexService.fetchTargetIndex(_symbol).pipe(
      take(1),
      map<RealTimeIndex | null, boolean | UrlTree>((data) => {
        if (!data) {
          // if user enter any index directly, there won't any result for sure
          return this.router.createUrlTree([`/market-index`]);
        }
        this.store.dispatch(fetchAllChangePercentage({ symbol: _symbol }));
        return true;
      })
    );
  }
}
