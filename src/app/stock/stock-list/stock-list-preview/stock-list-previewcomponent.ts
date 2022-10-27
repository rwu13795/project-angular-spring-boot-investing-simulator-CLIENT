import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { StockPerformanceLists } from "../stock-list-models";
import { StockListService } from "../stock-list.service";

@Component({
  selector: "app-stock-list-preview",
  templateUrl: "./stock-list-preview.component.html",
  styleUrls: ["./stock-list-preview.component.css"],
})
export class StockListPreviewComponent implements OnInit, OnDestroy {
  private previewList$?: Subscription;
  public previewList?: StockPerformanceLists;

  constructor(private stockListService: StockListService) {
    this.previewList = this.stockListService.getPreviewList();
    if (!this.previewList) {
      this.previewList$ = this.stockListService
        .fetchStockPerformanceList()
        .subscribe({
          complete: () => {
            this.previewList = this.stockListService.getPreviewList();
          },
        });
    } else {
      console.log("found saved lists");
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.previewList$) this.previewList$.unsubscribe();
  }
}
