import {
  ActionCreatorWithOptionalPayload,
  bindActionCreators,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type ActionCreators = Record<
  string,
  ActionCreatorWithOptionalPayload<any, string>
>;

type GenerateHooksReturn = {
  [K in keyof ActionCreators as `use${Capitalize<K>}Action`]: () => [
    ActionCreators[K]
  ];
};

export function generateHooks<T extends ActionCreators>(
  actionCreators: T
): GenerateHooksReturn {
  const hooks = {} as GenerateHooksReturn;

  for (const key in actionCreators) {
    hooks[`use${capitalize(key)}Action` as keyof GenerateHooksReturn] =
      () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const dispatch = useDispatch();
        const actionCreator = actionCreators[key];
        const boundActionCreator = bindActionCreators(actionCreator, dispatch);
        return [boundActionCreator as T[typeof key]];
      };
  }

  return hooks;
}
