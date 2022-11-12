import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

export const entryAnimation = trigger("entryAnimation", [
  state(
    "in",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  // use "void" as the state for the element that has yet to be added
  transition("void => *", [
    style({
      opacity: 0,
      transform: "translateX(80px)",
    }),
    animate("0.5s"),
  ]),
]);
