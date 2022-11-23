import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Input,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { LegacyPageEvent as PageEvent } from "@angular/material/legacy-paginator";
import { Store } from "@ngrx/store";
import { take } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { environment } from "src/environments/environment";
import { updateWatchlist_batch } from "../../user-state/user.actions";
import { UserService } from "../../user.service";

@Component({
  selector: "app-watch-list",
  templateUrl: "./watch-list.component.html",
  styleUrls: ["./watch-list.component.css"],
})
export class WatchListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("scrollRef") scrollRef?: ElementRef<HTMLElement>;
  private initialChange: boolean = true;

  @Input() watchlist: string[] = [];

  public LOGO_URL = environment.LOGO_URL;
  public pageSize: number = 10;
  public pageIndex: number = 0; // page num
  public totalCount: number = 0;
  public watchlistData: Response_realTimePrice[] = [];
  public loading: boolean = true;
  public toBeDeleted: { [symbol: string]: boolean } = {};

  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    console.log(this.watchlist);

    this.pageIndex = 0;
    this.totalCount = this.watchlist.length;
    this.fetchListInfo(0);
  }

  handlePageEvent(e: PageEvent) {
    console.log(e);
    this.pageIndex = e.pageIndex;
    this.fetchListInfo(this.pageIndex);

    const scrollRef = this.scrollRef?.nativeElement;
    if (scrollRef) {
      scrollRef.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  toFixed(number: number, addSymbol: boolean = true) {
    return this.userService.toFixedLocale({
      number,
      showZero: true,
      addSymbol,
    });
  }

  selectToRemove(symbol: string) {
    if (this.toBeDeleted[symbol]) {
      delete this.toBeDeleted[symbol];
    } else {
      this.toBeDeleted[symbol] = true;
    }
  }

  removeFromList() {
    // since each delete requires the component to update the DB and then
    // fetch the watchlist again, in order to not mess up the pagination
    // but this might cause issue if user needs to delete many items from
    // the list. So I chose to let the user delete in batch
    const symbols = Object.keys(this.toBeDeleted);
    this.toBeDeleted = {};
    this.userService
      .removeFromWatchlist_batch(symbols)
      .pipe(take(1))
      .subscribe(() => {
        // update the watchlist in the store, then the "new" watchlist from
        // the input will trigger the methods in the "ngOnChanges" to fetch the
        // watchlist from DB
        this.store.dispatch(updateWatchlist_batch({ symbols }));
      });
  }

  get isDeleteEmpty() {
    return Object.keys(this.toBeDeleted).length === 0;
  }

  ngOnDestroy(): void {}

  private fetchListInfo(pageIndex: number) {
    this.loading = true;
    this.userService
      .getWatchlistByPage_withPrice(pageIndex + 1)
      .pipe(take(1))
      .subscribe((data) => {
        this.watchlistData = data;
        this.loading = false;
      });
  }
}
