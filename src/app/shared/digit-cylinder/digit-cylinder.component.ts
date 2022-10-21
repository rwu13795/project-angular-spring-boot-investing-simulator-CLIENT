import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-digit-cylinder",
  templateUrl: "./digit-cylinder.component.html",
  styleUrls: ["./digit-cylinder.component.css"],
})
export class DigitCylinderComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() currentDigit: string = "0";
  @Input() previousDigit: string = "0";

  public showCylinder: boolean = true;

  // the "selector" "cylinder" can be the same for all the children
  // all of the children DigitCylinderComponent are seperate instances
  @ViewChild("cylinder") cylinder?: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    const regex = new RegExp("^[0-9]$");
    this.showCylinder = regex.test(this.currentDigit);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // The @Input() variable will be updated when new input is passed into
    // this component
    // In Angular, if I need to manipulate the DOM, I have to do it in the
    // "ngAfterViewInit". The elements will be available ONLY after the views
    // are fully rendered.
  }

  ngAfterViewInit(): void {
    const cylinder = this.cylinder?.nativeElement;

    // ----- (1) ----- //
    if (cylinder) {
      const distance = cylinder.offsetHeight / 10;
      cylinder.style.transform = `translateY(${
        distance * +this.previousDigit
      }px)`;

      setTimeout(() => {
        cylinder.classList.add("cylinder");

        cylinder.style.transform = `translateY(${
          distance * +this.currentDigit
        }px)`;
      }, 200);
    }
  }
}

/*  

----- (1) -----
When the real-time price is updated, the digit cylinders will be 
rendered if the new digit is not the same as the previous one.
while using *ngFor, the re-rendered cylinder component somehow (don't know why)
does NOT has the previous value of the input variable.

I have to manaully save the preivous and the current price in the ngrx store
and pass them to the cylinder component. After view init, first, I need to 
"translateY" the cylinder to the previous digit position. secondly, I need to
"translateY" the cylinder to the current digit position and add the "cylinder"
class at the same time. By doing, the digit will "slide" from the previous
digit to the current one.

If I set the current digit directly without setting the previous one first,
the digit transition will always start from the "0", since there is no previous
value and the default digit value is "0". The transition will be messed up.

I also need to wait for the translation of the previous digit before I could 
translate the current digit

*/
