import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Response_realTimePrice } from "../stock/stock-models";
import { StockService } from "../stock/stock.service";
import { MajorIndex, RealTimeIndex } from "./market-index-models";

@Injectable({ providedIn: "root" })
export class MarketIndexService {
  //   private SERVER_URL = environment.SERVER_URL;

  private FMP_API = "https://financialmodelingprep.com/api/v3";
  // for spring boot server
  private SERVER_URL = "http://localhost:8080/api";
  private API_KEY = "bebf0264afd8447938b0ae54509c1513";

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

  public fetchIndexHistory(option: string, symbol: string) {
    return this.stockService.fetchHistoryPrice(option, symbol);
  }

  public getIndexNormalSymbol(tickerSymbol: string) {
    if (this.majorIndex[tickerSymbol]) {
      return this.majorIndex[tickerSymbol].symbol;
    }
    return "";
  }
}
