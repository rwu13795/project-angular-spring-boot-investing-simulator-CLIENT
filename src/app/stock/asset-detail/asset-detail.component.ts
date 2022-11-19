import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription, take } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  Response_PortfolioAsset,
  Response_transaction,
} from "src/app/user/user-models";
import { selectTargetAsset } from "src/app/user/user-state/user.selectors";
import { UserService } from "src/app/user/user.service";
import { StockMenu } from "../stock-models";
import { setStockActiveMenu } from "../stock-state/stock.actions";

@Component({
  selector: "app-asset-detail",
  templateUrl: "./asset-detail.component.html",
  styleUrls: ["./asset-detail.component.css"],
})
export class AssetDetailComponent implements OnInit, OnDestroy {
  private asset$?: Subscription;

  public symbol: string = "";
  public totalCount: number = 0;
  public transactions: Response_transaction[] = [];
  public asset: Response_PortfolioAsset | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
      this.fetchTransactions(this.symbol, 1, "long");
      this.asset$ = this.store
        .select(selectTargetAsset(this.symbol))
        .subscribe((asset) => {
          this.asset = asset;
        });
    });

    this.store.dispatch(setStockActiveMenu({ menu: StockMenu.asset }));
  }

  changeTransactionType(type: number) {
    if (type === 1) {
      this.fetchTransactions(this.symbol, 1, "long");
    } else {
      this.fetchTransactions(this.symbol, 1, "short");
    }
  }

  ngOnDestroy(): void {
    if (this.asset$) this.asset$.unsubscribe();
  }

  private fetchTransactions(
    symbol: string,
    pageNum: number,
    type: "long" | "short"
  ) {
    this.userService
      .getAssetTransactionsCount(symbol, type)
      .pipe(take(1))
      .subscribe(({ count }) => {
        this.totalCount = count;
      });

    this.userService
      .getAssetTransactions(symbol, pageNum, type)
      .pipe(take(1))
      .subscribe((data) => {
        this.transactions = data;
      });
  }
}
