import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { setStockListOption } from "../stock-state/stock.actions";
import { selectStockListOption } from "../stock-state/stock.selectors";
import {
  ListTypes,
  Response_stockList,
  SortBy,
  StockPerformanceLists,
} from "./stock-list-models";
import { StockListService } from "./stock-list.service";

@Component({
  selector: "app-stock-list",
  templateUrl: "./stock-list.component.html",
  styleUrls: ["./stock-list.component.css"],
})
export class StockListComponent implements OnInit, OnDestroy {
  private performanceList$?: Subscription;
  private listType$?: Subscription;
  private ascDesc = this.initialAscDesc();

  public listType = ListTypes.actives;
  public lists: StockPerformanceLists = {
    [ListTypes.actives]: null,
    [ListTypes.gainers]: null,
    [ListTypes.losers]: null,
  };

  constructor(
    private stockListService: StockListService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.listType$ = this.store
      .select(selectStockListOption)
      .subscribe((data) => (this.listType = data));
    this.lists = this.stockListService.getStockList();
    if (!this.lists.actives) {
      this.performanceList$ = this.stockListService
        .fetchStockPerformanceList()
        .subscribe({
          complete: () => {
            this.lists = this.stockListService.getStockList();
          },
        });
    } else {
      console.log("found saved lists");
    }
  }

  public get ListTypes() {
    return ListTypes;
  }

  public get SortBy() {
    return SortBy;
  }

  onSelectOption(listType: ListTypes) {
    this.lists = this.stockListService.getStockList();
    this.store.dispatch(setStockListOption({ listType }));
    this.ascDesc = this.initialAscDesc();
  }

  onSort(sortBy: SortBy) {
    // toggle the ascending/descending order
    this.ascDesc[this.listType][sortBy] = !this.ascDesc[this.listType][sortBy];
    this.lists[this.listType] = this.stockListService.sortList(
      this.listType,
      sortBy,
      this.ascDesc[this.listType][sortBy]
    );
  }

  ngOnDestroy(): void {
    if (this.performanceList$) this.performanceList$.unsubscribe();
    if (this.listType$) this.listType$.unsubscribe();
  }

  private initialAscDesc() {
    return {
      [ListTypes.actives]: {
        [SortBy.changePercentage]: true,
        [SortBy.changeInPrice]: true,
        [SortBy.name]: true,
        [SortBy.price]: true,
        [SortBy.symbol]: true,
      },
      [ListTypes.gainers]: {
        [SortBy.changePercentage]: true,
        [SortBy.changeInPrice]: true,
        [SortBy.name]: true,
        [SortBy.price]: true,
        [SortBy.symbol]: true,
      },
      [ListTypes.losers]: {
        [SortBy.changePercentage]: true,
        [SortBy.changeInPrice]: true,
        [SortBy.name]: true,
        [SortBy.price]: true,
        [SortBy.symbol]: true,
      },
    };
  }
}
