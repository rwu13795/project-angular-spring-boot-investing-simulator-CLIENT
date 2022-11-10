import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Response_news } from "./news.models";

@Injectable({ providedIn: "root" })
export class NewsService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  public fetchNews(symbol: string = "") {
    const params = new HttpParams({
      fromObject: {
        symbol,
        limit: 30,
      },
    });

    return this.http.get<Response_news[]>(`${this.SERVER_URL}/stock/news`, {
      params,
    });
  }
}
