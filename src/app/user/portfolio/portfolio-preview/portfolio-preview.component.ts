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
      });
  }

  openSignInModal() {
    this.store.dispatch(toggleSignInModal({ open: true }));
  }

  get LoadingStatus() {
    return LoadingStatus_user;
  }

  ngOnDestroy(): void {
    if (this.hasAuth$) this.hasAuth$.unsubscribe();
  }
}
