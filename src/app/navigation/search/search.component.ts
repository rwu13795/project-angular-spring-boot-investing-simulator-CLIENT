import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";

import { Response_searchByName } from "./search.models";
import { SearchService } from "./search.service";

@Component({
  selector: "app-search.",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit, OnDestroy {
  private searchResult$?: Subscription;
  private inputTimer?: any;

  public inputValue: string = "";
  public searchResult: Response_searchByName[] = [];
  public selectedExchange: string = "NASDAQ";
  public LOGO_URL = environment.LOGO_URL;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  onSearchStockByName() {
    this.searchResult$ = this.searchService
      .searchStockByName(this.inputValue, this.selectedExchange)
      .subscribe((data) => {
        this.searchResult = data;
      });
  }

  onSelectExchange(value: string) {
    this.selectedExchange = value;
  }

  onInputChange(event: KeyboardEvent) {
    let value = (event.target as HTMLInputElement).value;

    if (this.inputTimer) clearTimeout(this.inputTimer);
    // after each user input change, set a 800ms timer to wait and see if user
    // is still entering input. If there is new input, the old timer will be
    // cleared and new timer will be created. If there is no input change
    // after 800ms, then trigger the callback (send http request and etc...)
    this.inputTimer = setTimeout(() => {
      if (value.toLowerCase() === "google") {
        value = "goog";
      }
      this.searchResult$ = this.searchService
        .searchStockByName(value, this.selectedExchange)
        .subscribe((data) => {
          this.searchResult = data;
        });
      this.inputValue = value;
    }, 800);
  }

  clearResult() {
    this.searchResult = [];
    this.inputValue = "";
  }

  ngOnDestroy(): void {
    if (this.searchResult$) this.searchResult$.unsubscribe();
  }
}
