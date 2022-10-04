import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

export interface Response_searchByName {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

@Injectable({ providedIn: "root" })
export class StockService {
  // FMP_API = "https://financialmodelingprep.com/api/v3/";
  SERVER_URL = "http://localhost:8080/api";

  // API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  fetchPosts(inputValue: string): Observable<Response_searchByName[]> {
    const params = new HttpParams({
      fromObject: {
        query: inputValue,
        limit: 10,
        exchange: "NASDAQ",
        // apikey: this.API_KEY,
      },
    });

    return this.http
      .get<Response_searchByName[]>(`${this.SERVER_URL}/stock/search`, {
        params,
      })
      .pipe(
        map<Response_searchByName[], Response_searchByName[]>((resonseData) => {
          return resonseData.sort((a, b) => {
            if (a.symbol < b.symbol) return -1;
            else if (a.symbol > b.symbol) return 1;
            else return 0;
          });
        })
      );
  }
}
