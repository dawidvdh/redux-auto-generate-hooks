import { useDispatch } from "react-redux";
import { bindActionCreators, Slice as RTKSlice } from "@reduxjs/toolkit";

type WrappedSliceMethods<Slice extends RTKSlice> = {
  [ActionName in keyof Slice["actions"]]: (
    ...args: Parameters<Slice["actions"][ActionName]>
  ) => void;
};

export const useSliceHook = <Slice extends RTKSlice>(
  slice: Slice
): WrappedSliceMethods<Slice> => {
  const dispatch = useDispatch();
  const { actions } = slice;

  const methods = Object.keys(actions).reduce((acc, k) => {
    const key = k as keyof typeof actions;

    if (actions[key]) {
      return {
        ...acc,
        [key]: bindActionCreators(actions[key], dispatch),
      };
    }

    return acc;
  }, {} as WrappedSliceMethods<Slice>);

  return methods;
};
