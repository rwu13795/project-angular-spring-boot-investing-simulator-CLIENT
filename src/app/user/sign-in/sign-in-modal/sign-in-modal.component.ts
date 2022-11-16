import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/ngrx-store/app.reducer";
import { toggleSignInModal } from "../../user-state/user.actions";
import { selectSignInModalOpen } from "../../user-state/user.selectors";

@Component({
  selector: "app-sign-in-modal",
  templateUrl: "./sign-in-modal.component.html",
  styleUrls: ["./sign-in-modal.component.css"],
})
export class SignInModalComponent implements OnInit, OnDestroy, OnChanges {
  public isOpen$ = this.store.select(selectSignInModalOpen);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  closeModal() {
    this.store.dispatch(toggleSignInModal({ open: false }));
  }

  ngOnDestroy(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
