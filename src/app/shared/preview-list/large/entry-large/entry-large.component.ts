import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import {
  ListTypes,
  Response_stockList,
  SortBy,
} from "../../preview-list-models";
import { PreviewListService } from "../../preview-list.service";

@Component({
  selector: "app-preview-list-large-entry",
  templateUrl: "./entry-large.component.html",
  styleUrls: ["./entry-large.component.css"],
})
export class PreviewLargeEntryComponent implements OnInit, OnDestroy {
  @Input() list: Response_stockList[] | null = null;
  @Input() listType: ListTypes = ListTypes.actives;
  private ascDesc = this.initialAscDesc();

  constructor(private previewListService: PreviewListService) {}

  ngOnInit(): void {}

  public get SortBy() {
    return SortBy;
  }

  onSort(sortBy: SortBy) {
    // toggle the ascending/descending order
    this.ascDesc[this.listType][sortBy] = !this.ascDesc[this.listType][sortBy];
    this.list = this.previewListService.sortList(
      this.listType,
      sortBy,
      this.ascDesc[this.listType][sortBy]
    );
  }

  ngOnDestroy(): void {}

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
