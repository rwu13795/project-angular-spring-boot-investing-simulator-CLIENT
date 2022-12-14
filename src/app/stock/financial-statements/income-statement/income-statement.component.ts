import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Response_incomeStatement } from "../financial-statements.models";
import { FinancialStatementsService } from "../financial-statements.service";

@Component({
  selector: "app-income-statement",
  templateUrl: "./income-statement.component.html",
  styleUrls: ["./income-statement.component.css"],
})
export class IncomeStatementComponent implements OnInit, OnDestroy {
  @Input() symbol: string = "";
  private incomeStatements$?: Subscription;
  public incomeStatements: Response_incomeStatement[] = [];

  constructor(private financialStatementsService: FinancialStatementsService) {}

  ngOnInit(): void {
    this.financialStatementsService
      .getFinancialStatements<Response_incomeStatement>(
        this.symbol,
        "income-statement"
      )
      .subscribe((data) => {
        this.incomeStatements = data;
        for (let elem of this.incomeStatements) {
          for (let [k, v] of Object.entries(elem)) {
            switch (k) {
              case "eps":
              case "epsdiluted":
              case "grossProfitRatio":
              case "incomeBeforeTaxRatio":
              case "ebitdaratio":
              case "netIncomeRatio": {
                elem[k] = parseFloat((+v).toFixed(3));
                break;
              }
              case "calendarYear": {
                break;
              }
              default: {
                if (v === 0) {
                  elem[k] = "-";
                } else {
                  elem[k] = (+v / 1000).toLocaleString();
                }
              }
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.incomeStatements$) this.incomeStatements$.unsubscribe();
  }
}
