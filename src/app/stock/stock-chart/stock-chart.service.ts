import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StockChartService {
  public toLocalString(value: string | number): string {
    if (typeof value === "string") {
      return parseInt(value).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    }

    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  public toSignificantDigit(value: number): string {
    if (value === 0) return "0";

    if (value < 0) {
      if (value < -999999999) {
        return `${value / 1000000000}B`;
      } else if (value < 999999) {
        return `${value / 1000000}M`;
      } else {
        return `${value / 1000}K`;
      }
    }

    // 1 trillion
    if (value > 999999999999) {
      let v: number | string = value / 1000000000000;
      if (value % 1000000000000 !== 0) v = v.toFixed(3);
      return `${v}T`;
    } else if (value > 999999999) {
      let v: number | string = value / 1000000000;
      if (value % 1000000000 !== 0) v = v.toFixed(3);
      return `${v}B`;
    } else if (value > 999999) {
      let v: number | string = value / 1000000;
      if (value % 1000000 !== 0) v = v.toFixed(3);
      return `${v}M`;
    } else {
      let v: number | string = value / 1000;
      if (value % 1000 !== 0) v = v.toFixed(3);
      return `${v}K`;
    }
  }

  public setCustomTooltip(
    data: any,
    seriesIndex: number,
    chartType: "line" | "candles",
    isRealTime?: boolean
  ) {
    // for the volumes bar
    if (seriesIndex === 1) {
      if (data === 0) return "<span></span>";
      if (!isRealTime) {
        return `<div style="padding: 8px 12px">
                <b>Volumns</b>: ${data.y.toLocaleString()}
              </div>`;
      }
      return `<div style="padding: 8px 12px">
                <b>Volumns</b>: ${data.toLocaleString()}
              </div>`;
    }

    // for the candle bar
    const styles =
      "padding: 4px 12px; display: grid; grid-template-columns: 1fr 1fr; grid-column-gap: 10px;";
    if (chartType === "candles") {
      if (data.y[0] === -1) return "<span></span>";
      return `<div style="padding: 0px;"> 
          <div style="background-color: #e7e7e7; padding: 6px 12px; text-align: center;">
            ${
              isRealTime
                ? new Date(data.y[4]).toLocaleTimeString()
                : new Date(data.y[4]).toLocaleString()
            }
          </div>
          <div style="${styles}">
            <b>Open:</b><span>${this.toLocalString(data.y[0])}</span> 
          </div> 
          <div style="${styles}">
            <b>High:</b><span>${this.toLocalString(data.y[1])}</span> 
          </div> 
          <div style="${styles}">
            <b>Low:</b><span>${this.toLocalString(data.y[2])}</span> 
          </div> 
          <div style="${styles}">
            <b>Close:</b><span>${this.toLocalString(data.y[3])}</span> 
          </div> 
        </div>`;
    } else {
      if (data.y === -1) return "<span></span>";
      return `<div style="padding: 0px;"> 
          <div style="background-color: #e7e7e7; padding: 6px 12px; text-align: center;">
            ${
              isRealTime
                ? new Date(data.meta[4]).toLocaleTimeString()
                : new Date(data.meta[4]).toLocaleString()
            }
          </div>
          <div style="${styles}"">
            <b>Open:</b><span>${this.toLocalString(data.meta[0])}</span> 
          </div> 
          <div style="${styles}"">
            <b>High:</b><span>${this.toLocalString(data.meta[1])}</span> 
          </div> 
          <div style="${styles}"">
            <b>Low:</b><span>${this.toLocalString(data.meta[2])}</span> 
          </div> 
          <div style="${styles}"">
            <b>Close:</b><span>${this.toLocalString(data.meta[3])}</span> 
          </div> 
        </div>`;
    }
  }

  public setCustomTooltip_overall(value: number, date: string) {
    const dateString = new Date(date).toLocaleString();
    const negative = "color: #e74c3c;";
    const positive = "color: #2ecc71;";
    const aboveZero = value >= 0;

    return `
    <div style="padding: 0px;"> 
      <div style="background-color: #e7e7e7; padding: 6px 12px; text-align: center;">
        ${dateString}
      </div>
      <div style="padding: 6px 12px; text-align: center;">
        Overall: <span style="${aboveZero ? positive : negative}">${
      aboveZero ? "+" : "-"
    }$${this.toLocalString(value)}</span>  
      </div> 
    </div>`;
  }

  public setCustomTooltip_column(value: number, label: string) {
    if (label === "noData") return "";

    let [shares, pricePerShare, timestamp, transactionType] = label.split("-");

    const dateString = new Date(+timestamp).toLocaleString();
    const negative = "color: #e74c3c;";
    const positive = "color: #2ecc71;";
    const aboveZero = value >= 0;
    const isRealized =
      transactionType !== "Buy" && transactionType !== "Sell short";

    return `
    <div style="padding: 0px;"> 
      <div style="background-color: #e7e7e7; padding: 6px 12px; text-align: center;">
        ${dateString}
      </div>
      ${
        isRealized
          ? `
        <div style="padding: 6px 12px; text-align: center;">
           Realized: <span style="${aboveZero ? positive : negative}">${
              aboveZero ? "+" : "-"
            }$${this.toLocalString(value)}</span>  
        </div>`
          : ""
      }
      <div style="padding: 6px 12px; text-align: center;">
        ${transactionType} ${shares} shares @ $${this.toLocalString(
      +pricePerShare
    )}
      </div>

    </div>`;
  }
}
