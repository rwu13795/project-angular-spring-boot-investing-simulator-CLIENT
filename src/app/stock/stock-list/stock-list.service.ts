import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, map, tap } from "rxjs";
import {
  ListTypes,
  Response_stockList,
  SortBy,
  StockPerformanceLists,
} from "./stock-list-models";

@Injectable({ providedIn: "root" })
export class StockListService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";

  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  private lists: StockPerformanceLists = {
    [ListTypes.actives]: null,
    [ListTypes.gainers]: null,
    [ListTypes.losers]: null,
  };

  constructor(private http: HttpClient) {}

  public fetchStockPerformanceList() {
    const params = new HttpParams({
      fromObject: { apikey: this.API_KEY },
    });

    return forkJoin([
      this.http.get<Response_stockList[]>(
        `${this.FMP_API}/stock_market/${ListTypes.gainers}`,
        { params }
      ),
      this.http.get<Response_stockList[]>(
        `${this.FMP_API}/stock_market/${ListTypes.losers}`,
        { params }
      ),
      this.http.get<Response_stockList[]>(
        `${this.FMP_API}/stock_market/${ListTypes.actives}`,
        { params }
      ),
    ]).pipe(
      map<
        [Response_stockList[], Response_stockList[], Response_stockList[]],
        void
      >(([gainers, losers, actives]) => {
        this.lists.gainers = gainers;
        this.lists.losers = losers;
        this.lists.actives = actives;
      })
    );
  }

  public getStockList() {
    console.log("get stock list");
    return { ...this.lists };
  }

  public getPreviewList() {
    if (!this.lists.actives || !this.lists.gainers || !this.lists.losers)
      return;
    return {
      [ListTypes.actives]: this.lists.actives.slice(0, 5),
      [ListTypes.gainers]: this.lists.gainers.slice(0, 5),
      [ListTypes.losers]: this.lists.losers.slice(0, 5),
    };
  }

  public sortList(
    listType: ListTypes,
    sortBy: SortBy,
    ascending: boolean
  ): Response_stockList[] | null {
    if (!this.lists[listType] === null) return null;

    const tempList = [...this.lists[listType]!];

    return this.sortByValue(sortBy, ascending, tempList);
  }

  public fetchPeerStocks(symbol: string) {}

  private sortByValue(
    sortBy: SortBy,
    ascending: boolean,
    list: Response_stockList[]
  ) {
    const sortFuction = ascending
      ? this.sortByAscending
      : this.sortByDescending;

    switch (sortBy) {
      case SortBy.name: {
        return list.sort((a, b) => sortFuction(a.name, b.name));
      }
      case SortBy.symbol: {
        return list.sort((a, b) => sortFuction(a.symbol, b.symbol));
      }
      case SortBy.changeInPrice: {
        return list.sort((a, b) => sortFuction(a.change, b.change));
      }
      case SortBy.price: {
        return list.sort((a, b) => sortFuction(a.price, b.price));
      }
      case SortBy.changePercentage: {
        return list.sort((a, b) =>
          sortFuction(a.changesPercentage, b.changesPercentage)
        );
      }
    }
  }

  private sortByAscending(a: number | string, b: number | string) {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else return 0;
  }

  private sortByDescending(a: number | string, b: number | string) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else return 0;
  }
}
