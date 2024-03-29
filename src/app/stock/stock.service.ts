import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AppState } from "../ngrx-store/app.reducer";
import { Response_transaction } from "../user/user-models";
import { Response_incomeStatement } from "./financial-statements/financial-statements.models";
import {
  ChartData,
  Response_historyPrice,
  Response_realTimePrice,
  StoredChartData,
  Response_quoteShort,
  Response_financialRatio,
  CustomTimeRange,
  OrderBody,
  OrderType,
} from "./stock-models";
import {
  setCurrentPrice,
  setCurrentChangeInPrice,
  setCurrentChangePercentage,
} from "./stock-state/stock.actions";

@Injectable({ providedIn: "root" })
export class StockService {
  private SERVER_URL = environment.SERVER_URL;

  // store the history data points in the service since user might keep switching
  // between the time range.
  private storedChartData: StoredChartData = {
    ["5D"]: null,
    ["1M"]: null,
    ["3M"]: null,
    ["6M"]: null,
    ["1Y"]: null,
    ["5Y"]: null,
  };
  public newOrderFilled = new Subject<"long" | "short">();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  public fetchHistoryPrice(
    option: string,
    symbol: string,
    customTimeRange?: CustomTimeRange
  ) {
    const { from, to, timeRange, interval } = this.getTimeRange(option);
    const params = new HttpParams({
      fromObject: {
        from,
        to,
        time_range: customTimeRange ? customTimeRange : timeRange,
        symbol,
        time_option: option,
      },
    });

    let apiUrl = `${this.SERVER_URL}/stock/price/historical-price`;
    if (timeRange === "") {
      apiUrl = `${this.SERVER_URL}/stock/price/historical-price-full`;
    }
    return this.http.get<Response_historyPrice[]>(apiUrl, { params }).pipe(
      map<Response_historyPrice[], ChartData>((responseData) => {
        return this.mapResponseData(responseData, option, interval);
      })
    );
  }

  public getRealTimePrice(symbol: string, setPriceInStore: boolean = true) {
    const params = new HttpParams({
      fromObject: { symbol },
    });

    return this.http
      .get<Response_realTimePrice[]>(
        `${this.SERVER_URL}/stock/price/real-time-quote`,
        { params }
      )
      .pipe(
        tap(([data]) => {
          if (setPriceInStore) {
            const { price, changesPercentage, change } = data;
            // set the latest price in the store, let the stock-price component
            // to update the price digit cylinder
            this.store.dispatch(setCurrentPrice({ currentPrice: price }));
            this.store.dispatch(
              setCurrentChangeInPrice({ changeInPrice: change })
            );
            this.store.dispatch(
              setCurrentChangePercentage({
                changePercentage: changesPercentage,
              })
            );
          }
        })
      );
  }

  /* NOTE
   There might be a limit on the number of symbols while using 
   symbolString "AAPL,GOOG,MSTF,..." to batch fetch in the FMP-api
*/
  public getQuoteShort(symbol: string) {
    const params = new HttpParams({
      fromObject: { symbol },
    });
    return this.http.get<Response_quoteShort[]>(
      `${this.SERVER_URL}/stock/price/short-quote`,
      { params }
    );
  }

  public getIncomeStatements(
    symbol: string,
    isFullYear: boolean,
    limit: number
  ) {
    const params = new HttpParams({
      fromObject: {
        symbol,
        type: "income-statement",
        period: isFullYear ? "annual" : "quarter",
        limit,
      },
    });
    return this.http.get<Response_incomeStatement[]>(
      `${this.SERVER_URL}/stock/financial-statement`,
      { params }
    );
  }

  public getFinancialRatios(symbol: string) {
    const params = new HttpParams({
      fromObject: { symbol },
    });
    return this.http.get<Response_financialRatio[]>(
      `${this.SERVER_URL}/stock/price/financial-ratio`,
      { params }
    );
  }

  public getStoredChartDate(option: string) {
    return this.storedChartData[option];
  }

  // By subscribing to "newOrderFilled", the transactions component wiil update
  // its transaction list whenever the trade-modal call the method below
  public newOrderFilled_emitter(orderType: OrderType) {
    let transactionTpye = 1;
    if (
      orderType === OrderType.BUY_TO_COVER ||
      orderType === OrderType.SELL_SHORT
    ) {
      transactionTpye = 2;
    }
    this.newOrderFilled.next(transactionTpye === 1 ? "long" : "short");
  }

  public isMarketOpen(): boolean {
    const UTCHours = new Date().getUTCHours();
    const UTCMinutes = new Date().getUTCMinutes();
    const UTCday = new Date().getUTCDay();
    const hasDST = this.hasDaylightSavingTime(new Date());
    const hour0900_EST = 14 - (hasDST ? 1 : 0);
    const hour1000_EST = 15 - (hasDST ? 1 : 0);
    const hour1600_EST = 21 - (hasDST ? 1 : 0);

    if (UTCday === 6 || UTCday === 0) return false;

    // ----------- for daylight saving ----------- //
    /*
        if (UTCHours < 13 || UTCHours >= 20) {
          return false;
        }
        if (UTCHours >= 13 && UTCHours < 14 && UTCMinutes < 30) {
          return false;
        }
    */
    // ---------- No DST --------- //
    /* 
         if (UTCHours < 14 || UTCHours >= 21) {
           return false;
         }
         if (UTCHours >= 14 && UTCHours < 15 && UTCMinutes < 30) {
           return false;
         }
    */
    if (UTCHours < hour0900_EST || UTCHours >= hour1600_EST) {
      return false;
    }
    if (
      UTCHours >= hour0900_EST &&
      UTCHours < hour1000_EST &&
      UTCMinutes < 30
    ) {
      return false;
    }
    return true;
  }

  public placeOrder({ symbol, shares, exchange, priceLimit, type }: OrderBody) {
    let route = "/portfolio/buy-sell";
    if (type === OrderType.BUY_TO_COVER || type === OrderType.SELL_SHORT) {
      route = "/portfolio/sell-short-buy-to-cover";
    }
    return this.http.post<Response_transaction>(
      `${this.SERVER_URL}${route}`,
      { symbol, shares, exchange, priceLimit, type },
      { withCredentials: true }
    );
  }

  public getTransactionType(buy?: boolean, shortSell?: boolean) {
    if (buy !== undefined) {
      return buy ? "Buy" : "Sell";
    }
    if (shortSell !== undefined) {
      return shortSell ? "Sell Short" : "Buy to Cover";
    }
    return "-";
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

    const oneDay = 86400000;
    let from_date: Date;
    let timeRange: string;
    let interval: number;
    switch (option) {
      case "5D": {
        if (to_date.getDay() === 5) {
          from_date = new Date(to_date.getTime() - oneDay * 4);
        } else {
          from_date = new Date(to_date.getTime() - oneDay * 6);
        }
        timeRange = "15min";
        interval = 60000 * 15;
        break;
      }
      case "1M": {
        from_date = new Date(to_date.getTime() - oneDay * 30);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "1hour";
        interval = 60000 * 60;
        break;
      }
      case "3M": {
        from_date = new Date(to_date.getTime() - oneDay * 90);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "4hour";
        interval = 60000 * 60 * 4;
        break;
      }
      case "6M": {
        from_date = new Date(to_date.getTime() - oneDay * 180);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "";
        interval = 60000 * 60 * 24;
        break;
      }
      case "1Y": {
        from_date = new Date(to_date.getTime() - oneDay * 365);
        from_date = this.fromWeekendsToMonday(from_date);
        timeRange = "";
        interval = 60000 * 60 * 24;
        break;
      }
      case "5Y": {
        from_date = new Date(to_date.getTime() - oneDay * 365 * 5);
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
        // return data of last 2 days, since there is NO data for the current day yet
        if (!this.isMarketOpen() && UTCday !== 6 && UTCday !== 0) {
          const hasDST = this.hasDaylightSavingTime(new Date());
          const hour0000_EST = 5 - (hasDST ? 1 : 0);
          const hour0900_EST = 14 - (hasDST ? 1 : 0);
          const UTCHours = new Date().getUTCHours();
          const UTCMinutes = new Date().getUTCMinutes();
          if (
            UTCHours >= hour0000_EST &&
            (UTCHours < hour0900_EST ||
              (UTCHours === hour0900_EST && UTCMinutes < 30))
          ) {
            to_date = new Date(
              to_date.getTime() - (UTCday === 1 ? oneDay * 3 : oneDay)
            );
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
      to: this.getDayString(
        to_date.getFullYear(),
        to_date.getMonth() + 1,
        to_date.getDate()
      ),
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

  private hasDaylightSavingTime(date: Date): boolean {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();

    return Math.max(january, july) !== date.getTimezoneOffset();
  }
}
