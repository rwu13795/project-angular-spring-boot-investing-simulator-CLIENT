import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription, take } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { Response_PortfolioAccount } from "src/app/user/user-models";
import { selectAccount } from "src/app/user/user-state/user.selectors";
import { UserService } from "src/app/user/user.service";
import { environment } from "src/environments/environment";
import { Response_realTimePrice } from "../stock-models";
import { toggleTradeModal } from "../stock-state/stock.actions";
import {
  selectCurrentSymbol,
  selectOpenTradeModal,
} from "../stock-state/stock.selectors";
import { StockService } from "../stock.service";

@Component({
  selector: "app-trade-modal",
  templateUrl: "./trade-modal.component.html",
  styleUrls: ["./trade-modal.component.css"],
})
export class TradeModalComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  private isOpen$?: Subscription;
  private account$?: Subscription;

  public LOGO_URL = environment.LOGO_URL;
  public isOpen: boolean = false;
  public symbol: string = "";
  public account: Response_PortfolioAccount | null = null;
  public quote: Response_realTimePrice | null = null;
  public priceLimit: number = 0;
  public quantity: number = 0;

  constructor(
    private store: Store<AppState>,
    private stockService: StockService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isOpen$ = this.store
      .select(selectOpenTradeModal)
      .subscribe((isOpen) => {
        this.isOpen = isOpen;

        if (isOpen) {
          this.symbol$ = this.store
            .select(selectCurrentSymbol)
            .subscribe((symbol) => {
              this.symbol = symbol;
              this.getQuote(symbol);
            });

          this.account$ = this.store
            .select(selectAccount)
            .subscribe((account) => {
              this.account = account;
            });
        }
      });
  }

  toFixed(number: number, addSymbol: boolean = false) {
    return this.userService.toFixedLocale({
      number,
      addSymbol,
      showZero: true,
    });
  }

  closeModal() {
    this.store.dispatch(toggleTradeModal({ open: false }));
  }

  onPriceLimitChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.priceLimit = +target.value;
  }

  onQtyChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.quantity = +target.value;
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.isOpen$) this.isOpen$.unsubscribe();
    if (this.account$) this.account$.unsubscribe();
  }

  private getQuote(symbol: string) {
    this.stockService
      .getRealTimePrice(symbol)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.length > 0) this.quote = data[0];
        this.priceLimit = data[0].price;
      });
  }
}
