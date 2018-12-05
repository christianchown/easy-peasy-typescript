import { Param1, Overwrite, Omit } from "type-zoo";
import Redux from "redux";

// conditional types from https://www.typescriptlang.org/docs/handbook/advanced-types.html#example-1
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// helpers to extract actions and values from easy-peasy models
type IsMoreThanOneParam<Func> = Func extends (a: any, b: undefined) => any
  ? {}
  : Func extends (a: undefined) => any
  ? {}
  : Func;
type FunctionWithoutFirstParam<F> = IsMoreThanOneParam<F> extends Function
  ? (payload: Param1<F>) => void
  : () => void;
type FunctionsWithoutFirstParam<T> = {
  [k in keyof T]: FunctionWithoutFirstParam<T[k]>
};
type ActionPrimitive = number | string | boolean | null | symbol;
type ActionFunction<ActionPayload = any> = ActionPayload extends
  | undefined
  | void
  ? () => void
  : ActionPayload extends ActionPrimitive | Array<ActionPrimitive>
  ? (payload: ActionPayload) => void
  : ActionPayload;

// given a model, get the state shapes of any reducer(...)s
type ReducerPropertyNames<T> = {
  [K in keyof T]: T[K] extends Reducer<any>
    ? FunctionReturnType<T[K]> extends void
      ? never
      : K
    : never
}[keyof T];
type ReducerProperties<T> = Pick<T, ReducerPropertyNames<T>>;
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type ReducerStateShapes<T> = {
  [K in keyof ReducerProperties<T>]: FunctionReturnType<ReducerProperties<T>[K]>
};

type NonReducerFunctionProperties<T> = Pick<
  T,
  Exclude<
    Exclude<FunctionPropertyNames<T>, ReducerPropertyNames<T>>,
    SelectPropertyNames<T>
  >
>;

// given a model, get the value types of any select(...)s
type SelectPropertyNames<T> = {
  [K in keyof T]: T[K] extends Select<any, any> ? K : never
}[keyof T];
type SelectProperties<T> = Pick<T, SelectPropertyNames<T>>;
type SelectPropertyTypes<T> = {
  [K in keyof SelectProperties<T>]: SelectProperties<T>[K] extends Select<
    any,
    infer R
  >
    ? R
    : never
};
type SelectValueTypes<Model> = {
  [K in keyof Model]: SelectPropertyTypes<Model[K]>
};

// given a model, get the value types of any reducer(...)s and select(...)s
type ReducerValues<Model> = ReducerStateShapes<Model> & SelectValueTypes<Model>;

// given an easy-peasy Model, extract just the actions
export type ModelActions<Model> = {
  [k in keyof Model]: Omit<
    FunctionsWithoutFirstParam<FunctionProperties<Model[k]>>,
    keyof ReducerValues<Model>[k]
  >
};

// given an easy-peasy Model, extract just the state values, minus reducers and select(...)s
export type MutableModelValues<Model> = {
  [k in keyof Model]: Omit<
    NonFunctionProperties<Model[k]>,
    keyof ReducerValues<Model>[k]
  >
};

// given an easy-peasy Model, extract just the state values
export type ModelValues<Model> = MutableModelValues<Model> &
  ReducerValues<Model>;

// easy-peasy's decorated Redux dispatch() (e.g. dispatch.todos.insert(item); )
export type Dispatch<Model = any> = Redux.Dispatch & ModelActions<Model>;

type EnhancerFunction = (
  ...funcs: Array<Redux.StoreEnhancer>
) => Redux.StoreEnhancer;

export interface Config<Model> {
  devTools?: boolean;
  initialState?: MutableModelValues<Model>;
  injections?: any;
  middleware?: Array<Redux.Middleware>;
  compose?: typeof Redux.compose | Redux.StoreEnhancer | EnhancerFunction;
  reducerEnhancer?: (reducer: Redux.Reducer) => Redux.Reducer;
}

export type Store<Model = any> = Overwrite<
  Redux.Store,
  { dispatch: Dispatch<Model>; getState: () => Readonly<ModelValues<Model>> }
>;
export type Action<StateValues, Payload = undefined> = Payload extends undefined
  ? (state: StateValues) => void | StateValues
  : (state: StateValues, payload: Payload) => void | StateValues;
export type Effect<
  Model,
  Payload = undefined,
  EffectResult = any
> = Payload extends undefined
  ? (
      effectAction: (
        dispatch: Dispatch<Model>,
        payload: undefined,
        getState: () => Readonly<ModelValues<Model>>
      ) => EffectResult,
      b?: undefined
    ) => EffectResult
  : (
      effectAction: (
        dispatch: Dispatch<Model>,
        payload: Payload,
        getState: () => Readonly<ModelValues<Model>>
      ) => EffectResult,
      b: Payload
    ) => EffectResult;
export type Reducer<State> = (state: State, action: Redux.Action) => State;
export type Select<StateValues, ResultantType> = (
  selectFunction: (state: StateValues) => ResultantType,
  dependencies?: Array<(state: any) => any>
) => never;

interface Vals0 {
  s0: string;
  n0: number;
}

interface Vals1 {
  s1: string;
  n1: number;
}

interface Vals2 {
  s2: string;
  n2: number;
}

interface Vals3 {
  s3: string;
  n3: number;
}

interface State {
  s0: string;
  n0: number;
  f0: (p00: string, p01: number) => void;
  sel0: Select<Vals0, boolean>;
  e0: Effect<State, string>;
  r0: Reducer<Vals0>;

  level1: {
    s1: string;
    n1: number;
    sel1: Select<Vals1, boolean>;
    f1: (p10: string, p11: number) => void;
    f12: () => void;
    f13: (p3: boolean) => void;
    e1: Effect<State, string>;
    r1: Reducer<Vals1>;

    level2: {
      s2: string;
      n2: number;
      sel2: Select<Vals2, boolean>;
      f2: (p20: string, p21: number) => void;
      e2: Effect<State, string>;
      r2: Reducer<Vals2>;

      level3: {
        s3: string;
        n3: number;
        sel3: Select<Vals3, boolean>;
        f3: (p30: string, p31: number) => void;
        e3: Effect<State, string>;
        r3: Reducer<Vals3>;
      };
    };
  };
}

type ObjectPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function
    ? never
    : T[K] extends object
    ? K
    : never
}[keyof T];
type ObjectProperties<T> = Pick<T, ObjectPropertyNames<T>>;
type NonObjectPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function
    ? never
    : T[K] extends object
    ? never
    : K
}[keyof T];
type NonObjectProperties<T> = Pick<T, NonObjectPropertyNames<T>>;

type L0Values<T> = NonObjectProperties<T>;
type L0Objects<T> = ObjectProperties<T>;
type L1Values<T> = {
  [k in keyof ObjectProperties<T>]: NonObjectProperties<ObjectProperties<T>[k]>
};
type L2Values<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: NonObjectProperties<
      ObjectProperties<ObjectProperties<T>[k]>[l]
    >
  }
};
type L3Values<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: NonObjectProperties<
        ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
      >
    }
  }
};
type L4Values<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: {
        [n in keyof ObjectProperties<
          ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
        >]: NonObjectProperties<
          ObjectProperties<
            ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
          >[n]
        >
      }
    }
  }
};

type L0Functions<T> = FunctionProperties<T>;
type L1Functions<T> = {
  [k in keyof ObjectProperties<T>]: FunctionProperties<ObjectProperties<T>[k]>
};
type L2Functions<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: FunctionProperties<
      ObjectProperties<ObjectProperties<T>[k]>[l]
    >
  }
};
type L3Functions<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: FunctionProperties<
        ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
      >
    }
  }
};
type L4Functions<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: {
        [n in keyof ObjectProperties<
          ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
        >]: FunctionProperties<
          ObjectProperties<
            ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
          >[n]
        >
      }
    }
  }
};

type FunctionsWithoutFirst<T> = {
  [k in keyof NonReducerFunctionProperties<T>]: FunctionWithoutFirstParam<
    NonReducerFunctionProperties<T>[k]
  >
};

type L0FunctionsWithout<T> = FunctionsWithoutFirstParam<
  NonReducerFunctionProperties<T>
>;
type L1FunctionsWithout<T> = {
  [k in keyof ObjectProperties<T>]: FunctionsWithoutFirst<
    ObjectProperties<T>[k]
  >
};
type L2FunctionsWithout<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<
      ObjectProperties<T>[k]
    >]: FunctionsWithoutFirst<ObjectProperties<ObjectProperties<T>[k]>[l]>
  }
};
type L3FunctionsWithout<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: FunctionsWithoutFirst<
        ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
      >
    }
  }
};
type L4FunctionsWithout<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: {
        [n in keyof ObjectProperties<
          ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
        >]: FunctionsWithoutFirst<
          ObjectProperties<
            ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
          >[n]
        >
      }
    }
  }
};

type L0SelectValues<T> = SelectPropertyTypes<T>;
type L1SelectValues<T> = {
  [k in keyof ObjectProperties<T>]: SelectPropertyTypes<ObjectProperties<T>[k]>
};
type L2SelectValues<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: SelectPropertyTypes<
      ObjectProperties<ObjectProperties<T>[k]>[l]
    >
  }
};
type L3SelectValues<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: SelectPropertyTypes<
        ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
      >
    }
  }
};
type L4SelectValues<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: {
        [n in keyof ObjectProperties<
          ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
        >]: SelectPropertyTypes<
          ObjectProperties<
            ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
          >[n]
        >
      }
    }
  }
};

type L0ReducerShapes<T> = ReducerStateShapes<T>;
type L1ReducerShapes<T> = {
  [k in keyof ObjectProperties<T>]: ReducerStateShapes<ObjectProperties<T>[k]>
};
type L2ReducerShapes<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: ReducerStateShapes<
      ObjectProperties<ObjectProperties<T>[k]>[l]
    >
  }
};
type L3ReducerShapes<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: ReducerStateShapes<
        ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
      >
    }
  }
};
type L4ReducerShapes<T> = {
  [k in keyof ObjectProperties<T>]: {
    [l in keyof ObjectProperties<ObjectProperties<T>[k]>]: {
      [m in keyof ObjectProperties<
        ObjectProperties<ObjectProperties<T>[k]>[l]
      >]: {
        [n in keyof ObjectProperties<
          ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
        >]: ReducerStateShapes<
          ObjectProperties<
            ObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>[m]
          >[n]
        >
      }
    }
  }
};

type MutableValues<T> = L0Values<T> &
  L1Values<T> &
  L2Values<T> &
  L3Values<T> &
  L4Values<T>;
type Functions<T> = L0Functions<T> &
  L1Functions<T> &
  L2Functions<T> &
  L3Functions<T> &
  L4Functions<T>;
type FunctionsWithout<T> = L0FunctionsWithout<T> &
  L1FunctionsWithout<T> &
  L2FunctionsWithout<T> &
  L3FunctionsWithout<T> &
  L4FunctionsWithout<T>;
type SelectValues<T> = L0SelectValues<T> &
  L1SelectValues<T> &
  L2SelectValues<T> &
  L3SelectValues<T> &
  L4SelectValues<T>;
type ReducerShapes<T> = L0ReducerShapes<T> &
  L1ReducerShapes<T> &
  L2ReducerShapes<T> &
  L3ReducerShapes<T> &
  L4ReducerShapes<T>;
type Values<T> = MutableValues<T> & SelectValues<T> & ReducerShapes<T>;
type Actions<T> = FunctionsWithout<T>;

type NoParams = () => void;
type OneParam = (param: number) => void;
type TwoParams = (param1: number, param2: string) => void;

type NoParam1 = IsMoreThanOneParam<NoParams>;
type OneParam1 = IsMoreThanOneParam<OneParam>;
type TwoParams1 = IsMoreThanOneParam<TwoParams>;

type NoParam2 = FunctionWithoutFirstParam<NoParams>;
type OneParam2 = FunctionWithoutFirstParam<OneParam>;
type TwoParams2 = FunctionWithoutFirstParam<TwoParams>;

export function a(l: Actions<State>) {
  l.level1.
}
