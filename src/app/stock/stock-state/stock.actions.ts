import { createAction, props } from "@ngrx/store";

export const setCurrentSymbol = createAction(
  "[Stock] Set Current Symbol",
  props<{ symbol: string }>()
);

// export const fetchRecipes = createAction("[Recipe] Fetch Recipes");
