import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectChangePercentage,
  selectCompanyProfile,
  selectChangeInPrice,
  selectCurrentPrice,
  selectCurrentSymbol,
} from "../stock-state/stock.selectors";
import {
  Response_companyProfile,
  Response_priceChangePercentage,
} from "../stock-models";

@Component({
  selector: "app-stock-price",
  templateUrl: "./stock-price.component.html",
  styleUrls: ["./stock-price.component.css"],
})
export class StockPriceComponent implements OnInit, OnDestroy {
  private symbol$?: Subscription;
  private profile$?: Subscription;
  private price$?: Subscription;
  private changeInPrice$?: Subscription;
  private changePercentage$?: Subscription;

  public symbol: string = "";
  public profile: Response_companyProfile | null = null;
  public price: number = 0;
  public changeInPrice: number = 0;
  public changePercentage: number = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.symbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe((data) => (this.symbol = data));
    this.profile$ = this.store
      .select(selectCompanyProfile)
      .subscribe((data) => (this.profile = data));
    this.price$ = this.store
      .select(selectCurrentPrice)
      .subscribe((data) => (this.price = data));
    this.changeInPrice$ = this.store
      .select(selectChangeInPrice)
      .subscribe((data) => (this.changeInPrice = data));
    this.changePercentage$ = this.store
      .select(selectChangePercentage)
      .subscribe((data) => (this.changePercentage = data));
  }

  ngOnDestroy(): void {
    if (this.symbol$) this.symbol$.unsubscribe();
    if (this.profile$) this.profile$.unsubscribe();
    if (this.price$) this.price$.unsubscribe();
    if (this.changeInPrice$) this.changeInPrice$.unsubscribe();
    if (this.changePercentage$) this.changePercentage$.unsubscribe();
  }
}
