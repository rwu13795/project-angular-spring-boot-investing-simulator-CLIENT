import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Response_incomeStatement } from "../../stock-models";
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
      .getIncomeStatements(this.symbol)
      .subscribe((data) => {
        this.incomeStatements = data;
      });
  }

  ngOnDestroy(): void {
    if (this.incomeStatements$) this.incomeStatements$.unsubscribe();
  }
}
