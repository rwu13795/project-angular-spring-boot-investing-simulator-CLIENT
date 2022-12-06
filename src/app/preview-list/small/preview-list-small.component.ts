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
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
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
  public loading: boolean = true;

  constructor(
    private previewListService: PreviewListService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("preview list symbol", this.symbol);

    if (this.symbol && this.symbol !== "all") {
      this.fetchPeerStockList(this.symbol);
    } else {
      this.fetchPreviewList();
    }
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

  private fetchPreviewList() {
    this.previewList = this.previewListService.getPreviewList();
    if (this.previewList) {
      this.loading = false;
      return;
    }
    this.previewList$ = this.previewListService
      .fetchStockPerformanceList()
      .subscribe({
        complete: () => {
          this.previewList = this.previewListService.getPreviewList();
          this.loading = false;
        },
      });
  }
  private fetchPeerStockList(symbol: string) {
    this.peerList = this.previewListService.getPeerStockList(symbol);
    if (this.peerList.length > 0) {
      this.loading = false;
      return;
    }
    this.peerList$ = this.previewListService
      .fetchPeerStockList(symbol)
      .subscribe((data) => {
        this.peerList = data;
        this.loading = false;
      });
  }
}
