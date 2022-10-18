import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BalanceSheetComponent } from "./balance-sheet/balance-sheet.component";
import { CashFlowComponent } from "./cash-flow/cash-flow.component";
import { FinancialStatementsComponent } from "./financial-statements.component";
import { IncomeStatementComponent } from "./income-statement/income-statement.component";

@NgModule({
  declarations: [
    FinancialStatementsComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    CashFlowComponent,
  ],
  imports: [CommonModule],
})
export class FinancialStatementsModule {}
