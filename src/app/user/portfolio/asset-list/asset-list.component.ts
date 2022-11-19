import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/ngrx-store/app.reducer";

import { StockService } from "src/app/stock/stock.service";
import { environment } from "src/environments/environment";
import { LoadingStatus_user, PortfolioAssetList } from "../../user-models";
import { selectLoadingStatus_user } from "../../user-state/user.selectors";
import { UserService } from "../../user.service";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrls: ["./asset-list.component.css"],
})
export class AssetListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("scrollRef") scrollRef?: ElementRef<HTMLElement>;
  private inputTimer$: any;

  @Input() assets: PortfolioAssetList = {};
  @Input() symbols: string[] = [];

  public loadingStore$ = this.store.select(selectLoadingStatus_user);
  public LOGO_URL = environment.LOGO_URL;
  public pageSize: number = 10;
  public selected: string[] = [];
  public pageIndex: number = 0; // page num
  public totalCount: number = 0;
  public loading: boolean = true;
  public filter: string = "";

  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    this.totalCount = this.symbols.length;
    this.getFirstTen();
  }

  onInputChange(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value.toUpperCase();
    clearTimeout(this.inputTimer$);
    this.pageIndex = 0;

    if (!value || value === "") {
      this.totalCount = this.symbols.length;
      this.getFirstTen();
      return;
    }
    this.inputTimer$ = setTimeout(() => {
      this.filter = value;
      this.selected = this.filterAsset(value);
      this.totalCount = this.selected.length;
    }, 500);
  }

  // ----- (1) ----- //
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    const from = this.pageIndex * this.pageSize;
    const to = this.pageIndex * this.pageSize + 10;
    this.selected = this.symbols.slice(from, to);

    const scrollRef = this.scrollRef?.nativeElement;
    if (scrollRef) {
      scrollRef.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  toFixed(number: number, decimal: number = 2) {
    return this.userService.toFixedLocale(number, false, decimal);
  }

  get LoadingStatus() {
    return LoadingStatus_user;
  }

  ngOnDestroy(): void {
    clearTimeout(this.inputTimer$);
  }

  private filterAsset(value: string) {
    if (!this.symbols) return [];
    const selected: string[] = [];
    this.symbols.forEach((symbol) => {
      if (symbol.includes(value)) selected.push(symbol);
    });
    this.loading = false;
    return selected;
  }

  private getFirstTen() {
    if (this.symbols.length > 10) {
      this.selected = this.symbols.slice(0, 10);
    } else {
      this.selected = this.symbols;
    }
    this.loading = false;
  }
}

/* 

// ----- (1) ----- //
the pagination <mat> handles all the calculation such as the total pages
I just need to pass the number of items into the [length] and
item-per-page into [pageSize], it will display the proper page selector
Then I can use the pageIndex to fetch the data from server

But in this component, I have all the items, so I still need to
slice the array to show the specific "page"

*/
