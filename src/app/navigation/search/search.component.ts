import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Response_searchByName } from "./search.models";
import { SearchService } from "./search.service";

@Component({
  selector: "app-search.",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit, OnDestroy {
  inputValue: string = "";
  searchResult: Response_searchByName[] = [];
  searchResult$?: Subscription;
  inputTimer?: any;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  onSearchStockByName() {
    this.searchResult$ = this.searchService
      .searchStockByName(this.inputValue, "NASDAQ")
      .subscribe((data) => {
        this.searchResult = data;
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

      this.searchResult$ = this.searchService
        .searchStockByName(value, "NASDAQ")
        .subscribe((data) => {
          this.searchResult = data;
        });

      this.inputValue = value;
    }, 800);
  }

  clear() {
    this.searchResult = [];
    this.inputValue = "";
  }

  ngOnDestroy(): void {
    if (this.searchResult$) this.searchResult$.unsubscribe();
  }
}
