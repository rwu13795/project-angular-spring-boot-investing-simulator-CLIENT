import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { RealTimeIndex } from "./market-index-models";
import { MarketIndexService } from "./market-index.service";

@Component({
  selector: "app-market-index",
  templateUrl: "./market-index.component.html",
  styleUrls: ["./market-index.component.css"],
})
export class MarketIndexComponent implements OnInit, OnDestroy {
  private fetchTargetIndex$?: Subscription;
  public symbol: string = "^DJI";
  public dayOption: string = "1D";
  public targetIndex: RealTimeIndex | null = null;

  constructor(
    private route: ActivatedRoute,
    private marketIndexService: MarketIndexService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const symbol = params["symbol"];

      if (symbol && symbol !== "") {
        this.symbol = symbol.toUpperCase();
        this.targetIndex = this.marketIndexService.getTargetIndex();

        if (!this.targetIndex) {
          this.fetchTargetIndex$ = this.marketIndexService
            .fetchTargetIndex(symbol)
            .subscribe((data) => {
              this.targetIndex = data;
            });
        }
      }
    });
  }

  public onSelectDayRange(dayOption: string) {
    this.dayOption = dayOption;
  }

  ngOnDestroy(): void {
    if (this.fetchTargetIndex$) this.fetchTargetIndex$.unsubscribe();
  }
}
