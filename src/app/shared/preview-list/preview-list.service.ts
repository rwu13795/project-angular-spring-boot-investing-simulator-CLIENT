import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, map, tap } from "rxjs";
import { Response_realTimePrice } from "src/app/stock/stock-models";
import { environment } from "src/environments/environment";
import {
  ListTypes,
  Response_stockList,
  SortBy,
  StockPerformanceLists,
} from "./preview-list-models";

@Injectable({ providedIn: "root" })
export class PreviewListService {
  private SERVER_URL = environment.SERVER_URL;

  private lists: StockPerformanceLists = {
    [ListTypes.actives]: null,
    [ListTypes.gainers]: null,
    [ListTypes.losers]: null,
  };
  private peerStockList: Response_realTimePrice[] = [];
  private currentSymbol: string | null = null;

  constructor(private http: HttpClient) {}

  public fetchStockPerformanceList() {
    return forkJoin([
      this.http.get<Response_stockList[]>(
        `${this.SERVER_URL}/stock/preview/all/${ListTypes.gainers}`
      ),
      this.http.get<Response_stockList[]>(
        `${this.SERVER_URL}/stock/preview/all/${ListTypes.losers}`
      ),
      this.http.get<Response_stockList[]>(
        `${this.SERVER_URL}/stock/preview/all/${ListTypes.actives}`
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

  public getPeerStockList(symbol: string) {
    if (this.currentSymbol === symbol) return this.peerStockList;

    this.peerStockList = [];
    this.currentSymbol = symbol;
    return [];
  }

  public fetchPeerStockList(symbol: string) {
    this.currentSymbol = symbol;
    const params = new HttpParams({
      fromObject: { symbol },
    });

    return this.http
      .get<Response_realTimePrice[]>(`${this.SERVER_URL}/stock/preview/peers`, {
        params,
      })
      .pipe(tap((data) => (this.peerStockList = data)));
  }

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
