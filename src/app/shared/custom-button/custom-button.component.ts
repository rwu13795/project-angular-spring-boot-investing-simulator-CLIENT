import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-custom-button",
  templateUrl: "./custom-button.component.html",
  styleUrls: ["./custom-button.component.css"],
})
export class CustomButtonComponent implements OnInit, OnChanges {
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
