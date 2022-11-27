import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Subscription, take } from "rxjs";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  InputField,
  Response_PortfolioAccount,
  Response_PortfolioAsset,
  Response_transaction,
} from "src/app/user/user-models";
import { fetchPortfolio } from "src/app/user/user-state/user.actions";
import {
  selectAccount,
  selectTargetAsset,
} from "src/app/user/user-state/user.selectors";
import { UserService } from "src/app/user/user.service";
import { environment } from "src/environments/environment";
import { OrderType } from "../stock-models";
import { toggleTradeModal } from "../stock-state/stock.actions";
import {
  selectCurrentPriceData,
  selectCurrentSymbol,
  selectOpenTradeModal,
} from "../stock-state/stock.selectors";
import { StockService } from "../stock.service";

enum ErrorField {
  FUND = "FUND",
  PRICE_LIMIT = "PRICE_LIMIT",
  QUANTITY = "QUANTITY",
  TYPE = "TYPE",
}

@Component({
  selector: "app-trade-modal",
  templateUrl: "./trade-modal.component.html",
  styleUrls: ["./trade-modal.component.css"],
})
export class TradeModalComponent implements OnInit, OnDestroy {
  @ViewChild("refreshRef") refreshRef?: ElementRef<HTMLSpanElement>;
  @ViewChild("priceRef") priceRef?: ElementRef<HTMLSpanElement>;
  private symbol$?: Subscription;
  private isOpen$?: Subscription;
  private account$?: Subscription;
  private asset$?: Subscription;
  private priceData$?: Subscription;
  private refreshTimer: any;
  private refreshAnimationTimer: any;
  private priceAnimationTimer: any;

  public errors: InputField = {};
  public LOGO_URL = environment.LOGO_URL;
  public isOpen: boolean = false;
  public symbol: string = "";
  public exchange: string = "";
  public account: Response_PortfolioAccount | null = null;
  public asset: Response_PortfolioAsset | null = null;
  public priceData: {
    price: number;
    change: number;
    changePercentage: number;
  } | null = null;
  public priceLimit: number = 0;
  public quantity: number = 0;
  public orderType?: OrderType;
  public filledOrder: Response_transaction | null = null;
  public loadingOrder: boolean = false;
  public currentTime: string = new Date().toLocaleString();
  public isMarketOpen: boolean = false;

  constructor(
    private store: Store<AppState>,
    private stockService: StockService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isOpen$ = this.store
      .select(selectOpenTradeModal)
      .subscribe((isOpen) => {
        this.isOpen = isOpen;
        this.isMarketOpen = this.stockService.isMarketOpen();

        if (isOpen) {
          this.symbol$ = this.store
            .select(selectCurrentSymbol)
            .subscribe((symbol) => {
              this.refreshQuote(symbol);
              this.symbol = symbol;

              this.asset$ = this.store
                .select(selectTargetAsset(symbol))
                .subscribe((asset) => {
                  this.asset = asset;
                });
            });

          this.priceData$ = this.store
            .select(selectCurrentPriceData)
            .subscribe((data) => {
              this.currentTime = new Date().toLocaleString();
              this.priceData = data;
              this.triggerPriceAnimation();
              // only update the price limit when user manually refresh the quote
              // this.priceLimit = data.price;
            });

          this.account$ = this.store
            .select(selectAccount)
            .subscribe((account) => {
              this.account = account;
            });
        }
      });
  }

  toFixed(
    number: number,
    addSymbol: boolean = false,
    showZero: boolean = true
  ) {
    return this.userService.toFixedLocale({
      number,
      addSymbol,
      showZero,
    });
  }

  closeModal() {
    this.store.dispatch(toggleTradeModal({ open: false }));
    // since the modal is always mounted as long as the stock component is mounted
    // I need to unsubscribe the subscription when the modal is closed,
    // otherwise, it will keep updating the data when it is closed.
    this.resetForm();
  }

  onPriceLimitChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.priceLimit = +target.value;
    this.errors[ErrorField.PRICE_LIMIT] = "";
    this.errors[ErrorField.FUND] = "";
  }

  onQtyChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.quantity = +target.value;
    this.errors[ErrorField.QUANTITY] = "";
    this.errors[ErrorField.FUND] = "";
  }

  onRefresh() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (this.refreshAnimationTimer) clearTimeout(this.refreshAnimationTimer);
    const icon = this.refreshRef?.nativeElement;
    if (icon) {
      icon.style.animation = "infinite rotate360 1s linear";
      this.refreshAnimationTimer = setTimeout(() => {
        icon.style.animation = "none";
      }, 2000);

      this.refreshTimer = setTimeout(() => {
        this.refreshQuote(this.symbol);
      }, 200);
    }
  }

  onTypeButton(type: OrderType) {
    this.orderType = type;
    this.errors[ErrorField.TYPE] = "";
    this.errors[ErrorField.QUANTITY] = "";
    this.errors[ErrorField.PRICE_LIMIT] = "";
  }

  onConfirm() {
    if (!this.orderType) {
      this.errors[ErrorField.TYPE] = "Please select an order type";
      return;
    }
    if (this.quantity <= 0) {
      this.errors[ErrorField.QUANTITY] = "The quantity must be more than 0";
      return;
    }

    if (!this.loadingOrder) {
      this.loadingOrder = true;
      this.stockService
        .placeOrder({
          symbol: this.symbol,
          shares: this.quantity,
          exchange: this.exchange,
          priceLimit: this.priceLimit,
          type: this.orderType,
        })
        .pipe(
          take(1),
          map((data) => {
            this.filledOrder = data;
          })
        )
        .subscribe({
          complete: () => {
            this.loadingOrder = false;
            // update the portfolio
            this.store.dispatch(fetchPortfolio());
            // emit the "newOrderFilled" event to let asset-detail update
            // transaction list
            if (this.orderType) {
              this.stockService.newOrderFilled_emitter(this.orderType);
            }
          },
          error: (e: any) => {
            const { field, message } = e.error;
            this.errors[field] = message;
            this.loadingOrder = false;
          },
        });
    }
  }

  toPortfolio() {
    this.router.navigate(["/user/portfolio"]);
  }

  getType(buy?: boolean, shortSell?: boolean) {
    return this.stockService.getTransactionType(buy, shortSell);
  }

  get OrderType() {
    return OrderType;
  }

  get ErrorField() {
    return ErrorField;
  }

  ngOnDestroy(): void {
    if (this.isOpen$) this.isOpen$.unsubscribe();
    this.resetForm();
    this.store.dispatch(toggleTradeModal({ open: false }));
  }

  // since the "getRealTimePrice" will also update the current price data
  // in the store I should use the selector to get the current price so that
  // the price will be automatically be updated in every 20 second (from the
  // stock-menu component's subscription)
  private refreshQuote(symbol: string) {
    this.stockService
      .getRealTimePrice(symbol)
      .pipe(take(1))
      .subscribe(([data]) => {
        this.exchange = data.exchange;
        this.currentTime = new Date().toLocaleString();
        // only update the price limit when user manually refresh the quote
        this.priceLimit = data.price;
      });
  }

  private resetForm() {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.account$) this.account$.unsubscribe();
    if (this.asset$) this.asset$.unsubscribe();
    if (this.priceData$) this.priceData$.unsubscribe();
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    if (this.refreshAnimationTimer) clearTimeout(this.refreshAnimationTimer);
    this.priceLimit = 0;
    this.quantity = 0;
    this.orderType = undefined;
    this.filledOrder = null;
  }

  private triggerPriceAnimation() {
    if (this.priceAnimationTimer) clearTimeout(this.priceAnimationTimer);
    if (!this.priceRef) return;
    const elem = this.priceRef.nativeElement;

    elem.style.animation = "heartBeat 1s";
    this.refreshAnimationTimer = setTimeout(() => {
      elem.style.animation = "none";
    }, 1200);
  }
}
