import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, Subject, throwError } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import {
  ChartData,
  Response_searchByName,
  Response_historyPriceFull,
  Response_historyPrice,
  Response_realTimePrice,
  StoredChartData,
  Response_incomeStatement,
  Response_quoteShort,
  Response_financialRatio,
} from "./stock-models";

@Injectable({ providedIn: "root" })
export class StockService {
  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

  private currentSymbol: string = "";
  private storedChartData: StoredChartData = {
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

  public fetchHistoryPrice(option: string, symbol: string) {
    // used to get the current Eastern GMT-0400 hour, if it is
    // greater than or equal to 16, then the market is close for NYSE and Nasdaq
    // new Date().getUTCHours() - 4

    this.currentSymbol = symbol;
    const { from, to, timeRange, interval } = this.getTimeRange(option);
    const params = new HttpParams({
      fromObject: { from, to, apikey: this.API_KEY },
    });

    let apiUrl = `${this.FMP_API}/historical-chart/${timeRange}/${symbol}`;
    if (timeRange === "") {
      apiUrl = `${this.FMP_API}/historical-price-full/${symbol}`;
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

  public getRealTimePrice(symbol: string) {
    this.currentSymbol = symbol;
    const params = new HttpParams({
      fromObject: { apikey: this.API_KEY },
    });
    return this.http.get<Response_realTimePrice[]>(
      `${this.FMP_API}/quote/${this.currentSymbol}`,
      { params }
    );
  }

  public getQuoteShort(symbol: string) {
    const params = new HttpParams({
      fromObject: { apikey: this.API_KEY },
    });
    return this.http.get<Response_quoteShort[]>(
      `${this.FMP_API}/quote-short/${symbol}`,
      { params }
    );
  }

  public getIncomeStatements(
    symbol: string,
    isFullYear: boolean,
    limit: number
  ) {
    this.currentSymbol = symbol;
    const params = new HttpParams({
      fromObject: {
        oeriod: isFullYear ? "annual" : "quarter",
        limit,
        apikey: this.API_KEY,
      },
    });
    return this.http.get<Response_incomeStatement[]>(
      `${this.FMP_API}/income-statement/${this.currentSymbol}`,
      { params }
    );
  }

  public getFiancialRatios(symbol: string) {
    this.currentSymbol = symbol;
    const params = new HttpParams({
      fromObject: {
        apikey: this.API_KEY,
      },
    });
    return this.http.get<Response_financialRatio[]>(
      `${this.FMP_API}/ratios-ttm/${this.currentSymbol}`,
      { params }
    );
  }

  public getStoredChartDate(option: string) {
    return this.storedChartData[option];
  }

  public isMarketOpened(): boolean {
    const UTCHours = new Date().getUTCHours();
    const UTCMinutes = new Date().getUTCMinutes();
    const UTCday = new Date().getUTCDay();

    if (UTCday === 6 || UTCday === 0) return false;

    if (UTCHours < 13 || UTCHours >= 20) {
      return false;
    }
    if (UTCHours >= 13 && UTCHours < 14 && UTCMinutes < 30) {
      return false;
    }
    return true;
  }

  /* ************************************************************************** */
  /*                            Helper methods                                  */
  /* ************************************************************************** */
  private mapResponseData(
    responseData: Response_historyPrice[],
    option: string,
    interval: number
  ): ChartData {
    const data: ChartData = {
      volumes: [],
      candles: [],
      candleLine: [],
      highBound: -1,
      lowBound: Infinity,
      currentTotalVolume: 0,
    };

    for (let i = responseData.length - 1; i >= 0; i--) {
      const { date, open, high, low, close, volume } = responseData[i];

      data.currentTotalVolume += volume;
      // get the price range
      if (high * 1.001 > data.highBound) {
        data.highBound = high * 1.001;
      }
      if (low * 0.999 < data.lowBound) {
        data.lowBound = low * 0.999;
      }
      // map the data into seperate arrays for the charts
      data.candles.push({
        x: new Date(date),
        y: [open, high, low, close, new Date(date).getTime()],
      });
      data.volumes.push({ x: new Date(date), y: volume });
      // use the "close" price for the line chart
      data.candleLine.push({
        x: new Date(date),
        y: close,
        meta: [open, high, low, close, new Date(date).getTime()],
      });
    }

    this.storedChartData[option] = data;

    return data;
  }

  private getTimeRange(option: string): {
    from: string;
    to: string;
    timeRange: string;
    interval: number;
  } {
    let to_date = new Date();
    to_date = this.fromWeekendsToFriday(to_date);

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
      case "5Y": {
        from_date = new Date(to_date.getTime() - 86400000 * 365 * 5);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "";
        interval = 60000 * 60 * 24 * 5;
        break;
      }
      // default is "1D"
      default: {
        const UTCday = new Date().getUTCDay();
        // If the day is NOT a week day, and the time is between 12:00AM and 9:30AM,
        // then I need to fetch the data of yesterday. Otherwise, the api will
        // return data of the ast 2 days, since there is NO data for the current day yet
        if (!this.isMarketOpened() && UTCday !== 6 && UTCday !== 0) {
          const UTCHours = new Date().getUTCHours();
          const UTCMinutes = new Date().getUTCMinutes();
          if (
            UTCHours >= 0 &&
            (UTCHours < 13 || (UTCHours === 13 && UTCMinutes < 30))
          ) {
            to_date = new Date(to_date.getTime() - 86400000);
          }
        }
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

  private fromWeekendsToFriday(date: Date): Date {
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
