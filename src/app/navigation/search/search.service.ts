import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Response_searchByName } from "./search.models";

@Injectable({ providedIn: "root" })
export class SearchService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  public searchStockByName(inputValue: string, exchange: string) {
    const params = new HttpParams({
      fromObject: {
        query: inputValue,
        exchange,
      },
    });

    return this.http
      .get<Response_searchByName[]>(`${this.SERVER_URL}/stock/search`, {
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
