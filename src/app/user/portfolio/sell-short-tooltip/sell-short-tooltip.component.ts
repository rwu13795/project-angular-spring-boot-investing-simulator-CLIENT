import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-sell-short-tooltip",
  templateUrl: "./sell-short-tooltip.component.html",
  styleUrls: ["./sell-short-tooltip.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class SellShortTooltipComponent {}

// In order to customize the tooltip, I have to diasble the "ViewEncapsulation"
// And to prevent this tooltip affect other components, I have to create
// an new component just for this tooltip! (there should be a fukking better way
// to customize the material UI)

// Also
// I have to make these class names unqiue, otherwise the other components
// might be messed up by the same css class
