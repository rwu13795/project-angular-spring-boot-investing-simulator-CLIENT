import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response_incomeStatement } from "../stock-models";

@Injectable({ providedIn: "root" })
export class FinancialStatementsService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  public getIncomeStatements(symbol: string) {
    const params = new HttpParams({
      fromObject: {
        poeriod: "annual",
        limit: 20,
        apikey: this.API_KEY,
      },
    });
    return this.http.get<Response_incomeStatement[]>(
      `${this.FMP_API}/income-statement/${symbol}`,
      { params }
    );
  }
}
