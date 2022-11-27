import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";

import { AppState } from "src/app/ngrx-store/app.reducer";
import { StockMenu } from "../stock-models";
import { setStockActiveMenu } from "../stock-state/stock.actions";
import { FinancialStatement } from "./financial-statements.models";

@Component({
  selector: "app-financial-statements",
  templateUrl: "./financial-statements.component.html",
  styleUrls: ["./financial-statements.component.css"],
})
export class FinancialStatementsComponent implements OnInit {
  public symbol: string = "";
  public type: FinancialStatement = FinancialStatement.IS;
  public isLargeScreen?: boolean;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.symbol = params["symbol"].toUpperCase();
    });

    this.breakpointObserver
      .observe(["(min-width: 1200px)"])
      .subscribe((state: BreakpointState) => {
        if (state.matches) this.isLargeScreen = true;
        else this.isLargeScreen = false;
      });

    this.store.dispatch(setStockActiveMenu({ menu: StockMenu.statement }));
  }

  onSelectStatement(type: FinancialStatement) {
    this.type = type;
  }

  get FinancialStatement() {
    return FinancialStatement;
  }
}
