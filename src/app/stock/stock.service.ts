import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, Subject } from "rxjs";
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

interface Response_historyPriceFull {
  // for the daily price api "/historical-price-full"
  historical: Response_historyPrice[];
}

export interface CandleData {
  x: Date; // timestamp
  y: number[]; // [open, high, low, close]
}
export interface VolumnData {
  x: Date; // timestamp
  y: number;
}

export interface ChartData {
  volumns: VolumnData[];
  candles: CandleData[];
  candleLine: VolumnData[];
  highBound: number;
  lowBound: number;
}

interface StoredData {
  ["5D"]: ChartData | null;
  ["1M"]: ChartData | null;
  ["3M"]: ChartData | null;
  ["6M"]: ChartData | null;
  ["1Y"]: ChartData | null;
  [range: string]: ChartData | null;
}

@Injectable({ providedIn: "root" })
export class StockService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";

  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";

  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  private storedData: StoredData = {
    ["5D"]: null,
    ["1M"]: null,
    ["3M"]: null,
    ["6M"]: null,
    ["1Y"]: null,
  };

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

  fetchHistoryPrice(option: string) {
    // used to get the current Eastern GMT-0400 hour, if it is
    // greater than or equal to 16, then the market is close for NYSE and Nasdaq
    // new Date().getUTCHours() - 4

    const { from, to, timeRange, interval } = this.getTimeRange(option);
    const params = new HttpParams({
      fromObject: { from, to, apikey: this.API_KEY },
    });

    let apiUrl = `${this.FMP_API}/historical-chart/${timeRange}/AAPL`;
    if (timeRange === "") {
      apiUrl = `${this.FMP_API}/historical-price-full/AAPL`;
      return this.http.get<Response_historyPriceFull>(apiUrl, { params }).pipe(
        map<Response_historyPriceFull, ChartData>((responseData) => {
          return this.mapResponseData(
            responseData.historical,
            option,
            interval
          );
        })
      );
    }
    return this.http.get<Response_historyPrice[]>(apiUrl, { params }).pipe(
      map<Response_historyPrice[], ChartData>((responseData) => {
        return this.mapResponseData(responseData, option, interval);
      })
    );
  }

  public getStoredDate(option: "5D" | "1M" | "3M" | "6M" | "1Y") {
    return this.storedData[option];
  }

  private mapResponseData(
    responseData: Response_historyPrice[],
    option: string,
    interval: number
  ): ChartData {
    const data: ChartData = {
      volumns: [],
      candles: [],
      candleLine: [],
      highBound: -1,
      lowBound: Infinity,
    };

    // put some "placeholders" at the start of the arrays
    if (option === "1D") {
      const firstEntryTimestamp = responseData[responseData.length - 1].date;
      for (let i = 6; i >= 1; i--) {
        const timestamp = new Date(
          new Date(firstEntryTimestamp).getTime() - interval * i
        );
        data.candles.push({
          x: timestamp,
          y: [-1],
        });
        data.volumns.push({ x: timestamp, y: 0 });
      }
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
        x: new Date(date),
        y: [open, high, low, close],
      });
      data.volumns.push({ x: new Date(date), y: volume });
      // use the "close" price for the line chart
      data.candleLine.push({ x: new Date(date), y: close });
    }

    // put some "placeholders" at the end of the arrays
    if (option === "1D") {
      const lastEntryTimestamp = responseData[0].date;
      for (let i = 1; i <= 6; i++) {
        const timestamp = new Date(
          new Date(lastEntryTimestamp).getTime() + interval * i
        );
        data.candles.push({
          x: timestamp,
          y: [-1],
        });
        data.volumns.push({ x: timestamp, y: 0 });
      }
    }

    this.storedData[option] = data;

    return data;
  }

  private getTimeRange(option: string): {
    from: string;
    to: string;
    timeRange: string;
    interval: number;
  } {
    let to_date = new Date();
    to_date = this.fromWeekendsToWeekday(to_date);

    let to: string = this.getDayString(
      to_date.getFullYear(),
      to_date.getMonth() + 1,
      to_date.getDate()
    );

    let from_date: Date;
    let timeRange: string;
    let interval: number;
    switch (option) {
      case "5D": {
        if (to_date.getDay() === 5) {
          from_date = new Date(to_date.getTime() - 86400000 * 4);
        } else {
          from_date = new Date(to_date.getTime() - 86400000 * 6);
        }
        timeRange = "15min";
        interval = 60000 * 15;
        break;
      }
      case "1M": {
        from_date = new Date(to_date.getTime() - 86400000 * 30);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "1hour";
        interval = 60000 * 60;
        break;
      }
      case "3M": {
        from_date = new Date(to_date.getTime() - 86400000 * 90);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "4hour";
        interval = 60000 * 60 * 4;
        break;
      }
      case "6M": {
        from_date = new Date(to_date.getTime() - 86400000 * 180);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "";
        interval = 60000 * 60 * 24;
        break;
      }
      case "1Y": {
        from_date = new Date(to_date.getTime() - 86400000 * 365);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "";
        interval = 60000 * 60 * 24;
        break;
      }
      default: {
        // default is "1D"
        from_date = to_date;
        timeRange = "1min";
        interval = 60000;
        break;
      }
    }

    return {
      from: this.getDayString(
        from_date.getFullYear(),
        from_date.getMonth() + 1,
        from_date.getDate()
      ),
      to,
      timeRange,
      interval,
    };
  }

  private getDayString(year: number, month: number, day: number): string {
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  }

  private fromWeekendsToMonday(date: Date): Date {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      return new Date(date.getTime() + 86400000);
    }
    if (dayOfWeek === 6) {
      return new Date(date.getTime() + 86400000 * 2);
    }
    return date;
  }

  private fromWeekendsToWeekday(date: Date): Date {
    // back track the date if date is on weekend
    if (date.getDay() === 6) {
      // 86400000 ms = 1 day
      return new Date(date.getTime() - 86400000);
    }
    if (date.getDay() === 0) {
      // 0 is sunday
      return new Date(date.getTime() - 86400000 * 2);
    }
    return date;
  }
}
