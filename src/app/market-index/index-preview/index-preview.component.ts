import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
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
  private indices$?: Subscription;

  @Input() showSlideOnly: boolean = false;

  public indices: RealTimeIndex[] = [];
  public targetIndexSymbol: string = "^DJI";
  public targetIndexName: string = "Dow Jones Industrial Average";
  public currentDate: string = "";

  constructor(private marketIndexService: MarketIndexService) {}

  ngOnInit(): void {
    this.indices$ = this.marketIndexService
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

  toFixed_2(number: number) {
    return number.toFixed(2);
  }

  ngOnDestroy(): void {
    if (this.indices$) this.indices$.unsubscribe();
  }
}
