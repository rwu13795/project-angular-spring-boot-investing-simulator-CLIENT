import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { RealTimeIndex } from "../market-index-models";

import { MarketIndexService } from "../market-index.service";

@Component({
  selector: "app-index-preview",
  templateUrl: "./index-preview.component.html",
  styleUrls: ["./index-preview.component.css"],
})
export class IndexPreviewComponent implements OnInit, OnDestroy {
  private fetchAllMajorIndices$?: Subscription;

  @Input() showSlideOnly: boolean = false;
  @Input() isLargeScreen: boolean = true;
  @Input() symbolFromParams: string = "";
  @Input() targetIndexSymbol: string = "^DJI";

  public indices: RealTimeIndex[] = [];
  public targetIndexName: string = "Dow Jones Industrial Average";
  public currentDate: string = "";

  constructor(private marketIndexService: MarketIndexService) {}

  ngOnInit(): void {
    this.fetchAllMajorIndices$ = this.marketIndexService
      .fetchAllMajorIndices()
      .subscribe((data) => {
        this.indices = data;
      });
    this.marketIndexService.targetIndexSymbol.subscribe((symbol) => {
      this.targetIndexSymbol = symbol;
    });
    this.marketIndexService.targetIndexName.subscribe((name) => {
      this.targetIndexName = name;
    });
    this.marketIndexService.currentDate.subscribe((date) => {
      this.currentDate = date;
    });
  }

  toFixedLocale(number: number, min: number = 2, max: number = 2) {
    return this.marketIndexService.toFixedLocale(number, min, max);
  }

  ngOnDestroy(): void {
    if (this.fetchAllMajorIndices$) this.fetchAllMajorIndices$.unsubscribe();
  }
}
