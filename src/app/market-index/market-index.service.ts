import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Response_realTimePrice } from "../stock/stock-models";
import { StockService } from "../stock/stock.service";
import { MajorIndex, RealTimeIndex } from "./market-index-models";

@Injectable({ providedIn: "root" })
export class MarketIndexService {
  private SERVER_URL = environment.SERVER_URL;

  private symbols: string[] = [
    "^DJI",
    "^DJT",
    "^NDX",
    "^IXIC",
    "^NYA",
    "^GSPC",
    "^MID",
    "^RUTTR",
  ];

  private majorIndex: MajorIndex = {
    "^DJI": {
      name: "Dow Jones Industrial Average",
      symbol: "DJIA",
    },
    "^DJT": {
      name: "Dow Jones Transportation Average",
      symbol: "DJT",
    },
    "^NDX": {
      name: "NASDAQ 100 Index",
      symbol: "NDX",
    },
    "^IXIC": {
      name: "NASDAQ Composite Index",
      symbol: "IXIC",
    },
    "^NYA": {
      name: "NYSE Composite Index",
      symbol: "NYA",
    },
    "^GSPC": {
      name: "S&P 500 Index",
      symbol: "SPX",
    },
    "^MID": {
      name: "S&P 400 Mid Cap Index",
      symbol: "MID",
    },
    "^RUTTR": {
      name: "Russell 2000 Index",
      symbol: "RUT",
    },
  };

  private targetIndex: RealTimeIndex | null = null;
  // use the emitter to the pass the current symbol from index table or slide
  // back to the index-preview
  public targetIndexSymbol = new EventEmitter<string>();
  public targetIndexName = new EventEmitter<string>();
  public currentDate = new EventEmitter<string>();

  constructor(private stockService: StockService) {}

  public fetchAllMajorIndices() {
    const symbolString: string = this.symbols.join();

    // Both the index and stock price use the same fmp-api route "/quote" to
    // get the current price/quote. But for the index, I need to map the
    // response data before pass them to the component
    return this.stockService.getRealTimePrice(symbolString).pipe(
      map<Response_realTimePrice[], RealTimeIndex[]>((data) => {
        return data.map((index) => {
          return {
            ...index,
            _symbol: this.majorIndex[index.symbol].symbol,
            name: this.majorIndex[index.symbol].name,
          };
        });
      })
    );
  }

  public fetchTargetIndex(symbol: string) {
    // the guard will use this method to check and see if the index symbol
    // is valid, if it is valid then put the data in the targetIndex
    return this.stockService.getRealTimePrice(symbol).pipe(
      map<Response_realTimePrice[], RealTimeIndex | null>((data) => {
        if (data.length > 0) {
          const index = data[0];
          this.targetIndex = {
            ...index,
            _symbol: this.majorIndex[index.symbol].symbol,
            name: this.majorIndex[index.symbol].name,
          };
          return this.targetIndex;
        }
        return null;
      })
    );
  }

  public getTargetIndex() {
    // after passing the guard, the targetIndex should not be null anymore,
    // return the current targetIndex. Also, I need to set the targetIndex
    // to null, so that the next target index won't using the same data
    if (this.targetIndex) {
      console.log("returning exited targetIndex");
      const temp = { ...this.targetIndex };
      this.targetIndex = null;
      return temp;
    }
    return null;
  }

  public fetchIndexHistory(option: string, symbol: string, isPreview: boolean) {
    return this.stockService.fetchHistoryPrice(
      option,
      symbol,
      isPreview ? "15min" : undefined
    );
  }

  public getIndexNormalSymbol(tickerSymbol: string) {
    if (this.majorIndex[tickerSymbol]) {
      return this.majorIndex[tickerSymbol].symbol;
    }
    return "";
  }
}
