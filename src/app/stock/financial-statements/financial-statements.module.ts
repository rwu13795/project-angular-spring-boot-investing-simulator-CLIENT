import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FinancialStatementsComponent } from "./financial-statements.component";
import { IncomeStatementComponent } from "./income-statement/income-statement.component";

@NgModule({
  declarations: [FinancialStatementsComponent, IncomeStatementComponent],
  imports: [CommonModule],
})
export class FinancialStatementsModule {}
