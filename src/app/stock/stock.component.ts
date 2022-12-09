import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "../ngrx-store/app.reducer";
import {
  selectCurrentSymbol,
  selectStockActiveMenu,
} from "./stock-state/stock.selectors";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { StockMenu } from "./stock-models";
import { Subscription } from "rxjs";
import { selectHasAuth } from "../user/user-state/user.selectors";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit, OnDestroy, AfterContentChecked {
  private activeMenu$?: Subscription;
  private currentSymbol$?: Subscription;

  public hasAuth = this.store.select(selectHasAuth);
  public currentSymbol: string = "";
  public isLargeScreen: boolean = true;
  public isSmallScreen: boolean = false;
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

    this.currentSymbol$ = this.store
      .select(selectCurrentSymbol)
      .subscribe(({ symbol }) => {
        this.currentSymbol = symbol;
      });

    // use Angular material CDK to observe the current window width
    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });

    this.breakpointObserver
      .observe(["(max-width: 765px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isSmallScreen = true;
        else this.isSmallScreen = false;
      });

    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (this.currentSymbol$) this.currentSymbol$.unsubscribe();
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
