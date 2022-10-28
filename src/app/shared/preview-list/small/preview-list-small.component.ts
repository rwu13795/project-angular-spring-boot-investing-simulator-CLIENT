import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { observable, Subscription } from "rxjs";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { setStockListOption } from "src/app/stock/stock-state/stock.actions";
import { ListTypes, StockPerformanceLists } from "../preview-list-models";
import { PreviewListService } from "../preview-list.service";

@Component({
  selector: "app-preview-list-small",
  templateUrl: "./preview-list-small.component.html",
  styleUrls: ["./preview-list-small.component.css"],
})
export class PreviewListSmallComponent implements OnInit, OnDestroy, OnChanges {
  @Input() symbol: string | null = null;
  private previewList$?: Subscription;
  private peerList$?: Subscription;
  public previewList?: StockPerformanceLists;
  public peerList?: Response_realTimePrice[];

  constructor(
    private previewListService: PreviewListService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.symbol) {
      this.fetchPeerStockList(this.symbol);
    } else {
      this.previewList = this.previewListService.getPreviewList();
      if (!this.previewList) {
        this.previewList$ = this.previewListService
          .fetchStockPerformanceList()
          .subscribe({
            complete: () => {
              this.previewList = this.previewListService.getPreviewList();
            },
          });
      } else {
        console.log("found saved lists");
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const symbol = changes["symbol"].currentValue;
    this.fetchPeerStockList(symbol);
  }

  public get ListTypes() {
    return ListTypes;
  }

  onSelectOption(listType: ListTypes) {
    this.store.dispatch(setStockListOption({ listType }));
    this.router.navigate(["performance"]);
  }

  ngOnDestroy(): void {
    if (this.previewList$) this.previewList$.unsubscribe();
    if (this.peerList$) this.peerList$.unsubscribe();
  }

  private fetchPeerStockList(symbol: string) {
    this.peerList = this.previewListService.getPeerStockList(symbol);
    if (this.peerList.length > 0) {
      console.log("saved list found");
      return;
    }
    this.peerList$ = this.previewListService
      .fetchPeerStockList(symbol)
      .subscribe((observable) => {
        observable.subscribe((data) => {
          this.peerList = data;
        });
      });
  }
}
