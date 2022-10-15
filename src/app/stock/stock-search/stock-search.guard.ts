import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, take, tap } from "rxjs";
import { Response_quoteShort } from "../stock-models";
import { StockService } from "../stock.service";
import { Store } from "@ngrx/store";
import {
  clearStockState,
  fetchCompanyProfile,
  fetchPriceChangePercentage,
  setCurrentSymbol,
} from "../stock-state/stock.actions";
import {
  selectCompanyProfile,
  selectCurrentSymbol,
} from "../stock-state/stock.selectors";

@Injectable({ providedIn: "root" })
export class StockSearchGuard implements CanActivate {
  constructor(
    private stockService: StockService,
    private router: Router,
    private store: Store
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

    this.store
      .select(selectCurrentSymbol)
      .pipe(
        take(1),
        tap((previousSymbol) => {
          if (previousSymbol !== symbol) {
            console.log("clearing stock state", previousSymbol, symbol);
            this.store.dispatch(clearStockState());
          }
        })
      )
      .subscribe();

    // use the quote-short api to find out if this symbol exists, since
    // the api will be fast and response with minimum data
    return this.stockService.getQuoteShort(symbol).pipe(
      take(1),
      map<Response_quoteShort[], boolean | UrlTree>((data) => {
        if (data.length === 0) {
          console.log("no-result");
          return this.router.createUrlTree([`/stock/no-result/${symbol}`]);
        }

        // If the symbol exists, then set the symbol in store
        this.store.dispatch(setCurrentSymbol({ symbol }));
        // get the price change percentage
        this.store.dispatch(fetchPriceChangePercentage({ symbol }));
        // fetch the company profile only if it is not in the store
        this.store
          .select(selectCompanyProfile)
          .pipe(
            take(1),
            tap((profile) => {
              if (!profile) {
                this.store.dispatch(fetchCompanyProfile({ symbol }));
              }
            })
          )
          .subscribe();
        return true;
      })
    );
  }
}
