import { Component, Input, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";

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
export class PreviewLargeEntryComponent implements OnDestroy {
  @Input() list: Response_stockList[] | null = null;
  @Input() listType: ListTypes = ListTypes.actives;
  private ascDesc = this.initialAscDesc();
  public LOGO_URL = environment.LOGO_URL;

  constructor(private previewListService: PreviewListService) {}

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

  ngOnDestroy(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  toFixedLocale(number: number) {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
