import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { setStockListOption } from "src/app/stock/stock-state/stock.actions";
import { selectStockListOption } from "src/app/stock/stock-state/stock.selectors";

import {
  ListTypes,
  Response_stockList,
  SortBy,
  StockPerformanceLists,
} from "../preview-list-models";
import { PreviewListService } from "../preview-list.service";

@Component({
  selector: "app-preview-list-large",
  templateUrl: "./preview-list-large.component.html",
  styleUrls: ["./preview-list-large.component.css"],
})
export class PreviewListLargeComponent implements OnInit, OnDestroy {
  private performanceList$?: Subscription;
  private listType$?: Subscription;

  public listType = ListTypes.actives;
  public lists: StockPerformanceLists = {
    [ListTypes.actives]: null,
    [ListTypes.gainers]: null,
    [ListTypes.losers]: null,
  };

  constructor(
    private previewListService: PreviewListService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.listType$ = this.store
      .select(selectStockListOption)
      .subscribe((data) => (this.listType = data));
    this.lists = this.previewListService.getStockList();
    if (!this.lists.actives) {
      this.performanceList$ = this.previewListService
        .fetchStockPerformanceList()
        .subscribe({
          complete: () => {
            this.lists = this.previewListService.getStockList();
          },
        });
    }
  }

  public get ListTypes() {
    return ListTypes;
  }

  public get SortBy() {
    return SortBy;
  }

  onSelectOption(listType: ListTypes) {
    this.listType = listType;
    this.lists = this.previewListService.getStockList();
    this.store.dispatch(setStockListOption({ listType }));
  }

  ngOnDestroy(): void {
    if (this.performanceList$) this.performanceList$.unsubscribe();
    if (this.listType$) this.listType$.unsubscribe();
  }
}
