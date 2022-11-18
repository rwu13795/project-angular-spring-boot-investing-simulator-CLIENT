import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import {
  PortfolioAssetList,
  PortfolioWatchlist,
  Response_Portfolio,
  Response_PortfolioAccount,
  Response_PortfolioAsset,
} from "../user-models";
import { selectPortfolio } from "../user-state/user.selectors";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.css"],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private portfolio$?: Subscription;

  public portfolio: Response_Portfolio | null = null;
  public account: Response_PortfolioAccount | null = null;
  public assets: PortfolioAssetList = {};
  public symbols: string[] = [];
  public watchlist: PortfolioWatchlist = {};
  public isOnAssets: boolean = true;

  constructor(
    private store: Store<AppState>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });

    this.store.select(selectPortfolio).subscribe((portfolio) => {
      if (!portfolio) return;
      this.portfolio = portfolio;
      this.account = this.portfolio.account;
      this.assets = this.portfolio.assets;
      this.symbols = this.portfolio.symbols;
      this.watchlist = this.portfolio.watchlist;
    });
  }

  toFixedLocale(number: number) {
    return this.userService.toFixedLocale(number);
  }

  onSelectMenu(menu: number) {
    this.isOnAssets = menu === 1;
  }

  ngOnDestroy(): void {
    if (this.portfolio$) this.portfolio$.unsubscribe();
  }
}
