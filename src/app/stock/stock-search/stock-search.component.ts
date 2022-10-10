import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Response_searchByName } from "../stock-models";
import { StockService } from "../stock.service";

@Component({
  selector: "app-stock-search.",
  templateUrl: "./stock-search.component.html",
  styleUrls: ["./stock-search.component.css"],
})
export class StockSearchComponent implements OnInit, OnDestroy {
  inputValue: string = "";
  stockSearchResult: Response_searchByName[] = [];
  stockSearchResult$?: Subscription;
  inputTimer?: any;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {}

  onSearchStockByName() {
    this.stockSearchResult$ = this.stockService
      .searchStockByName(this.inputValue)
      .subscribe((data) => {
        this.stockSearchResult = data;
      });
  }

  onInputChange(event: KeyboardEvent) {
    let value = (event.target as HTMLInputElement).value;

    if (this.inputTimer) clearTimeout(this.inputTimer);

    // after each user input change, set a 800ms timer to wait and see if user
    // is still entering input. If there is new input, the old timer will be
    // cleared and new timer will be created. If there is no input change
    // after 800ms, then trigger the callback (send http request and etc...)
    this.inputTimer = setTimeout(() => {
      console.log("input stop:", value);

      if (value.toLowerCase() === "google") {
        value = "goog";
      }

      this.stockSearchResult$ = this.stockService
        .searchStockByName(value)
        .subscribe((data) => {
          this.stockSearchResult = data;
        });

      this.inputValue = value;
    }, 800);
  }

  ngOnDestroy(): void {
    if (this.stockSearchResult$) this.stockSearchResult$.unsubscribe();
  }
}
