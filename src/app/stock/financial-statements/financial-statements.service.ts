import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  FinancialStatementType,
  Response_balanceSheet,
  Response_cashFlow,
  Response_incomeStatement,
} from "./financial-statements.models";

@Injectable({ providedIn: "root" })
export class FinancialStatementsService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  public getFinancialStatements<
    T extends
      | Response_incomeStatement
      | Response_balanceSheet
      | Response_cashFlow
  >(symbol: string, statementType: FinancialStatementType) {
    const params = new HttpParams({
      fromObject: {
        period: "annual",
        limit: 20,
        apikey: this.API_KEY,
      },
    });

    return this.http.get<T[]>(`${this.FMP_API}/${statementType}/${symbol}`, {
      params,
    });
  }
}
