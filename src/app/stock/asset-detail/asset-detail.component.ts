import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Subscription, take } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  Response_PortfolioAsset,
  Response_transaction,
} from "src/app/user/user-models";
import { selectTargetAsset } from "src/app/user/user-state/user.selectors";
import { UserService } from "src/app/user/user.service";
import { StockMenu, TransactionsData } from "../stock-models";
import { setStockActiveMenu } from "../stock-state/stock.actions";
import { StockService } from "../stock.service";

@Component({
  selector: "app-asset-detail",
  templateUrl: "./asset-detail.component.html",
  styleUrls: ["./asset-detail.component.css"],
})
export class AssetDetailComponent implements OnInit, OnDestroy {
  @ViewChild("scrollRef") scrollRef?: ElementRef<HTMLElement>;
  private asset$?: Subscription;

  public symbol: string = "";
  public totalCount: number = 0;
  public transactionData: TransactionsData | null = null;
  public asset: Response_PortfolioAsset | null = null;
  public positionType: number = 1;
  public isLargeScreen: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private stockService: StockService
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

    this.breakpointObserver
      .observe(["(min-width: 1000px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });
  }

  changeTransactionType(type: number) {
    this.positionType = type;
    if (type === 1) {
      this.fetchTransactions(this.symbol, 1, "long");
    } else {
      this.fetchTransactions(this.symbol, 1, "short");
    }
  }

  changePage(pageNum: number) {
    this.fetchTransactions(
      this.symbol,
      pageNum,
      this.positionType === 1 ? "long" : "short"
    );

    const scrollRef = this.scrollRef?.nativeElement;
    if (scrollRef) {
      scrollRef.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  toPortfolio() {
    this.router.navigate(["/user/portfolio"]);
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
      .pipe(
        take(1),
        map<Response_transaction[], TransactionsData>((data) => {
          const td: TransactionsData = {
            transactions: [],
            overallChart: [],
            buyChart: [],
            sellChart: [],
          };
          td.transactions = data;
          // map the arrays for the charts
          for (let i = data.length - 1; i >= 0; i--) {
            td.overallChart.push({
              x: new Date(data[i].timestamp),
              y: data[i].assetTotalRealizedGainLoss,
            });
            if (data[i].buy === true || data[i].shortSell === true) {
              let type = data[i].buy === true ? "Buy" : "Sell short";
              let metaString = `${data[i].shares}-${data[i].pricePerShare}-${data[i].timestamp}-${type}`;
              td.buyChart.push({ x: metaString, y: data[i].shares });
            } else {
              let type = data[i].buy === false ? "Sell" : "Buy to cover";
              let metaString = `${data[i].shares}-${data[i].pricePerShare}-${data[i].timestamp}-${type}`;
              td.sellChart.push({ x: metaString, y: data[i].realizedGainLoss });
            }
          }
          return td;
        })
      )
      .subscribe((data) => {
        this.transactionData = data;
      });
  }
}
