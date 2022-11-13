import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Response_balanceSheet } from "../financial-statements.models";
import { FinancialStatementsService } from "../financial-statements.service";

@Component({
  selector: "app-balance-sheet",
  templateUrl: "./balance-sheet.component.html",
  styleUrls: ["./balance-sheet.component.css"],
})
export class BalanceSheetComponent implements OnInit, OnDestroy {
  @Input() symbol: string = "";
  private balanceSheet$?: Subscription;
  public balanceSheet: Response_balanceSheet[] = [];

  constructor(private financialStatementsService: FinancialStatementsService) {}

  ngOnInit(): void {
    this.financialStatementsService
      .getFinancialStatements<Response_balanceSheet>(
        this.symbol,
        "balance-sheet-statement"
      )
      .subscribe((data) => {
        this.balanceSheet = data;
        for (let elem of this.balanceSheet) {
          for (let [k, v] of Object.entries(elem)) {
            if (k === "calendarYear") continue;
            if (v === 0) {
              elem[k] = "-";
            } else {
              elem[k] = (+v / 1000).toLocaleString();
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.balanceSheet$) this.balanceSheet$.unsubscribe();
  }
}
