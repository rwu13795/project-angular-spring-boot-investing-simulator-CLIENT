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
    // the stock-menu has the 20-second auto update, the latest price can
    // always be selected from the store. Then I will use the latest price
    // to update the unrealized gain/loss
    if (!this.asset) return;

    this.currentPrice$ = this.store
      .select(selectCurrentPrice)
      .subscribe((price) => {
        if (this.asset) {
          const { shares, sharesBorrowed, avgCost, avgBorrowed } = this.asset;
          this.marketValue = shares * price;
          this.marketValueShort = avgBorrowed * price;
          this.unrealized = (price - avgCost) * shares;
          this.unrealizedShort = (avgBorrowed - price) * sharesBorrowed;
        }
      });
  }

  toFixed(number: number, addSymbol: boolean = true, decimal: number = 2) {
    return this.userService.toFixedLocale({ number, decimal, addSymbol });
  }

  ngOnDestroy(): void {
    if (this.currentPrice$) this.currentPrice$.unsubscribe();
  }
}
