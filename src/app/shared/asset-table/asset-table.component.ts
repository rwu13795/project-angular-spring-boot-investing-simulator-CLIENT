import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  OnDestroy,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { AppState } from "src/app/ngrx-store/app.reducer";
import { selectCurrentPrice } from "src/app/stock/stock-state/stock.selectors";
import { Response_PortfolioAsset } from "src/app/user/user-models";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-asset-table",
  templateUrl: "./asset-table.component.html",
  styleUrls: ["./asset-table.component.css"],
})
export class AssetTableComponent implements OnInit, OnChanges, OnDestroy {
  private currentPrice$?: Subscription;

  @Input() asset: Response_PortfolioAsset | null = null;
  @Input() inAssetDetail: boolean = false;

  public marketValue: number = 0;
  public marketValueShort: number = 0;
  public unrealized: number = 0;
  public unrealizedShort: number = 0;

  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.asset) return;

    if (!this.inAssetDetail) {
      this.setAssetDetail();
    } else {
      // the stock-menu has the 20-second auto update, the latest price can
      // always be selected from the store. Then I will use the latest price
      // to update the unrealized gain/loss ONLY in asset-detail component
      this.currentPrice$ = this.store
        .select(selectCurrentPrice)
        .subscribe((price) => {
          if (!price || price === 0) return;
          this.setAssetDetail(price);
        });
    }
  }

  toFixed(number: number, addSymbol: boolean = true, decimal: number = 2) {
    return this.userService.toFixedLocale({ number, decimal, addSymbol });
  }

  ngOnDestroy(): void {
    if (this.currentPrice$) this.currentPrice$.unsubscribe();
  }

  private setAssetDetail(price: number = 0) {
    if (!this.asset) return;

    const { shares, sharesBorrowed, avgCost, avgBorrowed, currentPrice } =
      this.asset;
    // use the auto-updated price only in the asset-detail, since "selectCurrentPrice"
    // only select the current target stock. In the asset-list, I have to use the
    // "currentPrice" of each stock in the portfolio
    if (price === 0) price = currentPrice;

    this.marketValue = shares * price;
    this.marketValueShort = avgBorrowed * price;
    this.unrealized = (price - avgCost) * shares;
    this.unrealizedShort = (avgBorrowed - price) * sharesBorrowed;
  }
}
