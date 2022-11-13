import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "../ngrx-store/app.reducer";
import { selectStockActiveMenu } from "./stock-state/stock.selectors";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { StockMenu } from "./stock-models";
import { Subscription } from "rxjs";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit, OnDestroy, AfterContentChecked {
  private activeMenu$?: Subscription;

  public isLargeScreen: boolean = true;
  public activeMenu: StockMenu | null = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activeMenu$ = this.store
      .select(selectStockActiveMenu)
      .subscribe((data) => {
        this.activeMenu = data;
      });

    // use Angular material CDK to observe the current window width
    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });
  }

  // ---- (1) ---- //
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  get StockMenu() {
    return StockMenu;
  }

  ngOnDestroy(): void {
    if (this.activeMenu$) this.activeMenu$.unsubscribe();
  }
}

/*

---- (1) ---- 
I need to update the container's class according to the active menu,
and since the activeMenu is fetched asynchronously, it's value will be
changed after the the view is checked
ERROR Error: NG0100: "Expression has changed after it was checked" 
the solution to this is add the following code


*/
