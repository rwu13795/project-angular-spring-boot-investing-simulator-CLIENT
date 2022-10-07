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
  highBound: number;
  lowBound: number;
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
    // used to get the current Eastern GMT-0400 hour, if it is
    // greater than or equal to 16, then the market is close for NYSE and Nasdaq
    // new Date().getUTCHours() - 4

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    let date = today.getDate();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 6) {
      // 86400000 ms = 1 day
      date = new Date(today.getTime() - 86400000).getDate();
    }
    if (dayOfWeek === 7) {
      // 86400000 ms = 1 day
      date = new Date(today.getTime() - 86400000 * 2).getDate();
    }
    // Did NOT have the time to implement the holidays check

    const dayString = `${year}-${month < 10 ? `0${month}` : month}-${
      date < 10 ? `0${date}` : date
    }`;
    const params = new HttpParams({
      fromObject: {
        to: dayString,
        from: dayString,
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
          const data: ChartData = {
            volumns: [],
            candles: [],
            candleLine: [],
            highBound: -1,
            lowBound: Infinity,
          };

          // put some "placeholders" at the start of the arrays
          const firstEntryTimestamp =
            responseData[responseData.length - 1].date;
          for (let i = 8; i >= 1; i--) {
            const timestamp =
              new Date(firstEntryTimestamp).getTime() - 60000 * i * 1;
            data.candles.push({
              x: timestamp,
              y: [-1],
            });
            data.volumns.push({ x: timestamp, y: 0 });
          }

          for (let i = responseData.length - 1; i >= 0; i--) {
            const { date, open, high, low, close, volume } = responseData[i];

            // get the price range
            if (high * 1.002 > data.highBound) {
              data.highBound = high * 1.002;
            }
            if (low * 0.998 < data.lowBound) {
              data.lowBound = low * 0.998;
            }

            // map the data into seperate arrays for the charts
            data.candles.push({
              x: new Date(date).getTime(),
              y: [open, high, low, close],
            });
            data.volumns.push({ x: new Date(date).getTime(), y: volume });
            // use the "close" price for the line chart
            data.candleLine.push({ x: new Date(date).getTime(), y: close });
          }

          // put some "placeholders" at the end of the arrays
          const lastEntryTimestamp = responseData[0].date;
          for (let i = 1; i <= 8; i++) {
            const timestamp =
              new Date(lastEntryTimestamp).getTime() + 60000 * i * 1;
            data.candles.push({
              x: timestamp,
              y: [-1],
            });
            data.volumns.push({ x: timestamp, y: 0 });
          }

          return data;
        })
      );
  }
}
