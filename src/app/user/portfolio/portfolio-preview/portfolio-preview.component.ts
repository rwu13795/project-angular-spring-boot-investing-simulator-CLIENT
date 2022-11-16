import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { LoadingStatus_user } from "../../user-models";
import { toggleSignInModal } from "../../user-state/user.actions";
import {
  selectHasAuth,
  selectLoadingStatus_user,
} from "../../user-state/user.selectors";

@Component({
  selector: "app-user-portfolio-preview",
  templateUrl: "./portfolio-preview.component.html",
  styleUrls: ["./portfolio-preview.component.css"],
})
export class PortfolioPreviewComponent implements OnInit, OnDestroy {
  public loadingStatus$ = this.store.select(selectLoadingStatus_user);
  public hasAuth$ = this.store.select(selectHasAuth);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  openSignInModal() {
    this.store.dispatch(toggleSignInModal({ open: true }));
  }

  get LoadingStatus() {
    return LoadingStatus_user;
  }

  ngOnDestroy(): void {}
}
