import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { RealTimeIndex } from "../market-index-models";

import { MarketIndexService } from "../market-index.service";

@Component({
  selector: "app-index-preview",
  templateUrl: "./index-preview.component.html",
  styleUrls: ["./index-preview.component.css"],
})
export class IndexPreviewComponent implements OnInit, OnDestroy {
  private indices$?: Subscription;
  public indices: RealTimeIndex[] = [];

  constructor(private marketIndexService: MarketIndexService) {}

  ngOnInit(): void {
    this.marketIndexService.fetchAllMajorIndices().subscribe((data) => {
      this.indices = data;
    });
  }

  ngOnDestroy(): void {
    if (this.indices$) this.indices$.unsubscribe();
  }
}
