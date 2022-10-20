import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { StockService } from "../stock/stock.service";
import {
  MajorIndex,
  RealTimeIndex,
  Response_realTimeIndex,
} from "./market-index-models";

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

  constructor(private http: HttpClient, private stockService: StockService) {}

  public fetchAllMajorIndices() {
    const symbolString: string = this.symbols.join();

    const params = new HttpParams({
      fromObject: {
        apikey: this.API_KEY,
      },
    });

    console.log("symbols string", symbolString);

    return this.http
      .get<Response_realTimeIndex[]>(`${this.FMP_API}/quote/${symbolString}`, {
        params,
      })
      .pipe(
        map<Response_realTimeIndex[], RealTimeIndex[]>((data) => {
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
}
