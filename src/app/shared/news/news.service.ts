import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response_news } from "./news.models";

@Injectable({ providedIn: "root" })
export class NewsService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  public fetchNews(symbol: string = "", page: number = 0) {
    const params = new HttpParams({
      fromObject: {
        tickers: symbol,
        page,
        limit: 100,
        apikey: this.API_KEY,
      },
    });

    return this.http.get<Response_news[]>(`${this.FMP_API}/stock_news`, {
      params,
    });
  }
}
