import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from "@angular/core";
import { Response_PortfolioAsset } from "src/app/user/user-models";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-asset-table",
  templateUrl: "./asset-table.component.html",
  styleUrls: ["./asset-table.component.css"],
})
export class AssetTableComponent implements OnInit, OnChanges {
  @Input() asset: Response_PortfolioAsset | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  toFixed(number: number, addSymbol: boolean = true, decimal: number = 2) {
    return this.userService.toFixedLocale({ number, decimal, addSymbol });
  }
}
