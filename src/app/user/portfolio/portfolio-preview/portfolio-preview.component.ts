import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { LoadingStatus_user, Response_Portfolio } from "../../user-models";
import {
  fetchPortfolio,
  setLoadingStatus_user,
  toggleSignInModal,
} from "../../user-state/user.actions";
import {
  selectHasAuth,
  selectLoadingStatus_user,
  selectPortfolio,
} from "../../user-state/user.selectors";

@Component({
  selector: "app-user-portfolio-preview",
  templateUrl: "./portfolio-preview.component.html",
  styleUrls: ["./portfolio-preview.component.css"],
})
export class PortfolioPreviewComponent implements OnInit, OnDestroy {
  private hasAuth$?: Subscription;
  private portfolio$?: Subscription;

  public loadingStatus$ = this.store.select(selectLoadingStatus_user);
  public hasAuth: boolean = false;
  public portfolio: Response_Portfolio | null = null;
  public realized: number = 0;
  public unrealized: number = 0;
  public isPositiveRealized = true;
  public isPositiveUnrealized = true;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.hasAuth$ = this.store.select(selectHasAuth).subscribe((hasAuth) => {
      this.hasAuth = hasAuth;
      if (this.hasAuth) {
        this.store.dispatch(
          setLoadingStatus_user({ status: LoadingStatus_user.failed_portfolio })
        );
        this.store.dispatch(fetchPortfolio());
      }
    });

    this.portfolio$ = this.store
      .select(selectPortfolio)
      .subscribe((portfolio) => {
        this.portfolio = portfolio;
        this.realized =
          portfolio.account.totalRealizedGainLoss +
          portfolio.account.totalRealizedGainLoss_shortSelling;
        this.unrealized =
          portfolio.account.totalUnrealizedGainLoss +
          portfolio.account.totalUnrealizedGainLoss_shortSelling;
        this.isPositiveRealized = this.realized >= 0;
        this.isPositiveUnrealized = this.unrealized >= 0;
      });
  }

  openSignInModal() {
    this.store.dispatch(toggleSignInModal({ open: true }));
  }

  get LoadingStatus() {
    return LoadingStatus_user;
  }

  toFixedLocale(number: number) {
    const temp = number >= 0 ? number : number * -1;
    return temp.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnDestroy(): void {
    if (this.hasAuth$) this.hasAuth$.unsubscribe();
  }
}
