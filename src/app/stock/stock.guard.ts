import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, take } from "rxjs";

import { Store } from "@ngrx/store";
import { Response_quoteShort } from "./stock-models";
import {
  setCurrentSymbol,
  fetchAllChangePercentage,
  fetchCompanyProfile,
} from "./stock-state/stock.actions";
import { selectCompanyProfile } from "./stock-state/stock.selectors";
import { StockService } from "./stock.service";
import { AppState } from "../ngrx-store/app.reducer";

@Injectable({ providedIn: "root" })
export class StockGuard implements CanActivate {
  constructor(
    private stockService: StockService,
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
    const symbol: string = urlArray[3];

    // use the quote-short api to find out if this symbol exists, since
    // the api will be fast and response with minimum data
    return this.stockService.getQuoteShort(symbol).pipe(
      take(1),
      map<Response_quoteShort[], boolean | UrlTree>((data) => {
        if (data.length === 0) {
          return this.router.createUrlTree([`/no-result/stock/${symbol}`]);
        }

        // If the symbol exists, then set the symbol in store
        this.store.dispatch(setCurrentSymbol({ symbol }));

        this.store
          .select(selectCompanyProfile)
          .pipe(
            take(1),
            map((profile) => {
              // fetch the company profile only if it is not in the store,

              // Also, only fetch the "fetchAllChangePercentage" once, since the
              // data is delayed and only used for the historical chart
              // If I keep fetching it in the guard, it will change the current latest
              // price and changes when user navigate between the stock menu

              // the latest price and changes will be fetched in the stock-menu
              // in every 20 second if the current component is not stock-chart
              if (!profile) {
                this.store.dispatch(fetchAllChangePercentage({ symbol }));
                this.store.dispatch(fetchCompanyProfile({ symbol }));
              }
            })
          )
          .subscribe(); // for the selector
        return true;
      })
    );
  }
}
