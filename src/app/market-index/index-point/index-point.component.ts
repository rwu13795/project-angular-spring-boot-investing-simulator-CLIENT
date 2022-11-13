import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  selectChangeInPrice,
  selectChangePercentage,
  selectCurrentPrice,
  selectPreviousChangeInPrice,
  selectPreviousChangePercentage,
  selectPreviousPrice,
  selectTimeRange,
} from "src/app/stock/stock-state/stock.selectors";

@Component({
  selector: "app-index-point",
  templateUrl: "./index-point.component.html",
  styleUrls: ["./index-point.component.css"],
})
export class IndexPointComponent implements OnInit, OnDestroy {
  private point$?: Subscription;
  private previousPoint$?: Subscription;
  private changeInPoint$?: Subscription;
  private previousChangeInPoint$?: Subscription;
  private changePercentage$?: Subscription;
  private previousChangePercentage$?: Subscription;

  @Input() isLargeScreen: boolean = true;

  public point: string[] = ["0"];
  public previousPoint: string[] = ["0"];
  public changeInPoint: string[] = ["0"];
  public previousChangeInPoint: string[] = ["0"];
  public changePercentage: string[] = ["0"];
  public previousChangePercentage: string[] = ["0"];
  public timeRange = this.store.select(selectTimeRange);
  public changeNumber: number = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.point$ = this.store.select(selectCurrentPrice).subscribe((data) => {
      this.point = this.toStringArray(data);
    });
    this.previousPoint$ = this.store
      .select(selectPreviousPrice)
      .subscribe((data) => {
        this.previousPoint = this.toStringArray(data);
      });

    this.changeInPoint$ = this.store
      .select(selectChangeInPrice)
      .subscribe((data) => {
        this.changeInPoint = this.toStringArray(data);
        this.changeNumber = data;
      });
    this.previousChangeInPoint$ = this.store
      .select(selectPreviousChangeInPrice)
      .subscribe((data) => {
        this.previousChangeInPoint = this.toStringArray(data);
      });

    this.changePercentage$ = this.store
      .select(selectChangePercentage)
      .subscribe((data) => {
        this.changePercentage = this.toStringArray(data, 2, 3);
      });
    this.previousChangePercentage$ = this.store
      .select(selectPreviousChangePercentage)
      .subscribe((data) => {
        this.previousChangePercentage = this.toStringArray(data, 2, 3);
      });
  }

  ngOnDestroy(): void {
    if (this.point$) this.point$.unsubscribe();
    if (this.changeInPoint$) this.changeInPoint$.unsubscribe();
    if (this.changePercentage$) this.changePercentage$.unsubscribe();
    if (this.previousPoint$) this.previousPoint$.unsubscribe();
    if (this.previousChangeInPoint$) this.previousChangeInPoint$.unsubscribe();
    if (this.previousChangePercentage$)
      this.previousChangePercentage$.unsubscribe();
  }

  private toStringArray(
    data: number,
    min: number = 2,
    max: number = 2
  ): string[] {
    return [
      ...data.toLocaleString(undefined, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      }),
    ];
  }
}
