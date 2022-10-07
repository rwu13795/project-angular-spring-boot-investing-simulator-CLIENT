import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

export interface Response_searchByName {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
  exchangeShortName: string;
}

export interface Response_historyPrice {
  date: string;
  open: number;
  low: number;
  high: number;
  close: number;
  volume: number;
}

export interface CandleData {
  x: number; // timestamp
  y: number[]; // [open, high, low, close]
}
export interface VolumnData {
  x: number; // timestamp
  y: number;
}

export interface ChartData {
  volumns: VolumnData[];
  candles: CandleData[];
  candleLine: VolumnData[];
}

@Injectable({ providedIn: "root" })
export class StockService {
  FMP_API = "https://financialmodelingprep.com/api/v3";

  // for spring boot server
  SERVER_URL = "http://localhost:8080/api";

  API_KEY = "bebf0264afd8447938b0ae54509c1513";

  constructor(private http: HttpClient) {}

  searchStockByName(inputValue: string): Observable<Response_searchByName[]> {
    const params = new HttpParams({
      fromObject: {
        query: inputValue,
        limit: 10,
        exchange: "NASDAQ",
        // apikey: this.API_KEY,
      },
    });

    // Spring boot
    // get<Response_searchByName[]>(`${this.SERVER_URL}/stock/search`
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

  fetchHistoryPrice() {
    const params = new HttpParams({
      fromObject: {
        to: "2022-10-04",
        from: "2022-10-04",
        apikey: this.API_KEY,
      },
    });

    return this.http
      .get<Response_historyPrice[]>(
        `${this.FMP_API}/historical-chart/1min/AAPL`,
        { params }
      )
      .pipe(
        map<Response_historyPrice[], ChartData>((responseData) => {
          const data: ChartData = { volumns: [], candles: [], candleLine: [] };

          // put some "placeholders" at the start of the arrays
          const firstEntryTimestamp =
            responseData[responseData.length - 1].date;
          const lastEntryTimestamp = responseData[0].date;
          // for(let i = 7; i >=0 ; i--) {
          //   data.candles.push({
          //     x: new Date(date),
          //     y: [-1],
          //   });
          //   data.volumns.push({ x: new Date(date), y: volume });
          //   data.candleLine.push({ x: new Date(date), y: close });
          // }

          // for (let i = responseData.length - 1; i >= 0; i--) {
          //   const { date, open, high, low, close, volume } = responseData[i];
          //   data.candles.push({
          //     x: new Date(date),
          //     y: [open, high, low, close],
          //   });
          //   data.volumns.push({ x: new Date(date), y: volume });
          //   // use the "close" price for the line chart
          //   data.candleLine.push({ x: new Date(date), y: close });
          // }

          // put some "placeholders" at the end of the arrays

          return data;
        })
      );
  }
}
