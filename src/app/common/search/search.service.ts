import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Response_searchByName } from "./search.models";

@Injectable({ providedIn: "root" })
export class SearchService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  public searchStockByName(inputValue: string) {
    const params = new HttpParams({
      fromObject: {
        query: inputValue,
        limit: 20,
        exchange: "NASDAQ",
        apikey: this.API_KEY,
      },
    });

    // Spring boot
    // get<Response_searchByName[]>(`${this.SERVER_URL}/stock/search`
    return this.http
      .get<Response_searchByName[]>(`${this.FMP_API}/search`, {
        params,
      })
      .pipe(
        map<Response_searchByName[], Response_searchByName[]>(
          (responseData) => {
            return responseData.sort((a, b) => {
              if (a.symbol < b.symbol) return -1;
              else if (a.symbol > b.symbol) return 1;
              else return 0;
            });
          }
        )
      );
  }
}
