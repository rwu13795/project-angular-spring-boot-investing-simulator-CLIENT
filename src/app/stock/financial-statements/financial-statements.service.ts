import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import {
  FinancialStatementType,
  Response_balanceSheet,
  Response_cashFlow,
  Response_incomeStatement,
} from "./financial-statements.models";

@Injectable({ providedIn: "root" })
export class FinancialStatementsService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  public getFinancialStatements<
    T extends
      | Response_incomeStatement
      | Response_balanceSheet
      | Response_cashFlow
  >(symbol: string, type: FinancialStatementType) {
    const params = new HttpParams({
      fromObject: {
        symbol,
        type,
        period: "annual",
        limit: 30,
      },
    });

    return this.http.get<T[]>(`${this.SERVER_URL}/stock/financial-statement`, {
      params,
    });
  }
}
