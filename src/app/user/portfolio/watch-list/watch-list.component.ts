import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Input,
} from "@angular/core";

@Component({
  selector: "app-watch-list",
  templateUrl: "./watch-list.component.html",
  styleUrls: ["./watch-list.component.css"],
})
export class WatchListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() watchlist: string[] = [];

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
