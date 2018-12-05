declare module "easy-peasy" {
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

  // given a model slice, get the state shapes of any reducer(...)s
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
    [K in keyof ReducerProperties<T>]: FunctionReturnType<
      ReducerProperties<T>[K]
    >
  };

  // all non-select(...) non-reducer(....) functions in a model slice
  type NonReducerFunctionProperties<T> = Pick<
    T,
    Exclude<
      Exclude<FunctionPropertyNames<T>, ReducerPropertyNames<T>>,
      SelectPropertyNames<T>
    >
  >;

  // given a model slice, get the value types of any select(...)s
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

  type L0Values<T> = NonObjectProperties<T>;
  type L0Objects<T> = ObjectProperties<T>;
  type L1Values<T> = {
    [k in keyof ObjectProperties<T>]: NonObjectProperties<
      ObjectProperties<T>[k]
    >
  };
  type L2Values<T> = {
    [k in keyof ObjectProperties<T>]: {
      [l in keyof ObjectProperties<
        ObjectProperties<T>[k]
      >]: NonObjectProperties<ObjectProperties<ObjectProperties<T>[k]>[l]>
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

  type L0Actions<T> = FunctionsWithoutFirstParam<
    NonReducerFunctionProperties<T>
  >;
  type L1Actions<T> = {
    [k in keyof ObjectProperties<T>]: FunctionsWithoutFirst<
      ObjectProperties<T>[k]
    >
  };
  type L2Actions<T> = {
    [k in keyof ObjectProperties<T>]: {
      [l in keyof ObjectProperties<
        ObjectProperties<T>[k]
      >]: FunctionsWithoutFirst<ObjectProperties<ObjectProperties<T>[k]>[l]>
    }
  };
  type L3Actions<T> = {
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
  type L4Actions<T> = {
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
    [k in keyof ObjectProperties<T>]: SelectPropertyTypes<
      ObjectProperties<T>[k]
    >
  };
  type L2SelectValues<T> = {
    [k in keyof ObjectProperties<T>]: {
      [l in keyof ObjectProperties<
        ObjectProperties<T>[k]
      >]: SelectPropertyTypes<ObjectProperties<ObjectProperties<T>[k]>[l]>
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

  type MutableModelValues<T> = L0Values<T> &
    L1Values<T> &
    L2Values<T> &
    L3Values<T> &
    L4Values<T>;
  type Functions<T> = L0Functions<T> &
    L1Functions<T> &
    L2Functions<T> &
    L3Functions<T> &
    L4Functions<T>;
  type ModelActions<T> = L0Actions<T> &
    L1Actions<T> &
    L2Actions<T> &
    L3Actions<T> &
    L4Actions<T>;
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
  type ModelValues<T> = MutableModelValues<T> &
    SelectValues<T> &
    ReducerShapes<T>;

  // easy-peasy's decorated Redux dispatch() (e.g. dispatch.todos.insert(item); )
  type Dispatch<Model = any> = Redux.Dispatch & ModelActions<Model>;

  /**
   * https://github.com/ctrlplusb/easy-peasy#createstoremodel-config
   *
   * Example usage:
   *
   * interface Model {
   *   todos: {
   *     items: Array<string>;
   *     addTodo: Action<{ items: Array<string> }, string>;
   *   },
   *   session: {
   *     user: User;
   *   }
   * }
   *
   * const store = createStore<Model>({
   *   todos: {
   *     items: [],
   *     addTodo: (state, text) => {
   *       state.items.push(text)
   *     }
   *   },
   *   session: {
   *     user: undefined,
   *   }
   * })
   */

  type EnhancerFunction = (
    ...funcs: Array<Redux.StoreEnhancer>
  ) => Redux.StoreEnhancer;

  interface Config<Model> {
    devTools?: boolean;
    initialState?: MutableModelValues<Model>;
    injections?: any;
    middleware?: Array<Redux.Middleware>;
    compose?: typeof Redux.compose | Redux.StoreEnhancer | EnhancerFunction;
    reducerEnhancer?: (reducer: Redux.Reducer) => Redux.Reducer;
  }

  type Store<Model = any> = Overwrite<
    Redux.Store,
    { dispatch: Dispatch<Model>; getState: () => Readonly<ModelValues<Model>> }
  >;

  function createStore<Model = any>(
    model: Model,
    config?: Config<Model>
  ): Store<Model>;

  /**
   * https://github.com/ctrlplusb/easy-peasy#action
   *
   * Example usage:
   *
   * const add: Action<TodoValues, string> = (state => payload) => {
   *   state.items.push(payload)
   * }
   */

  type Action<StateValues, Payload = undefined> = Payload extends undefined
    ? (state: StateValues) => void | StateValues
    : (state: StateValues, payload: Payload) => void | StateValues;

  /**
   * https://github.com/ctrlplusb/easy-peasy#effectaction
   *
   * Example usage:
   *
   * const login: Effect<Model, Credentials> = effect(async (dispatch, payload) => {
   *   const user = await loginService(payload)
   *   dispatch.session.loginSucceeded(user)
   * })
   *
   * or
   *
   * const login = effect<Model, Credentials>(async (dispatch, payload) => {
   *   const user = await loginService(payload)
   *   dispatch.session.loginSucceeded(user)
   * })
   */

  type Effect<
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

  function effect<Model = any, Payload = never, EffectResult = any>(
    effectAction: (
      dispatch: Dispatch<Model>,
      payload: Payload,
      getState: () => Readonly<ModelValues<Model>>
    ) => EffectResult
  ): Effect<Model, Payload, EffectResult>;

  /**
   * https://github.com/ctrlplusb/easy-peasy#reducerfn
   *
   * Example usage:
   *
   * const counter: Reducer<number> = reducer((state = 1, action) => {
   *   switch (action.type) {
   *     case 'INCREMENT': state + 1;
   *     default: return state;
   *   }
   * }
   *
   * or
   *
   * const counter = reducer<number>((state = 1, action) => {
   *   switch (action.type) {
   *     case 'INCREMENT': state + 1;
   *     default: return state;
   *   }
   * }
   */

  type Reducer<State> = (state: State, action: Redux.Action) => State;

  function reducer<State>(reducerFunction: Reducer<State>): Reducer<State>;

  /**
   * https://github.com/ctrlplusb/easy-peasy#selectselector
   *
   * Example usage:
   *
   * const totalPrice: Select<ShoppingBasket, number> = select(state =>
   *   state.products.reduce((acc, cur) => acc + cur.price, 0)
   * )
   *
   * or
   *
   * const totalPrice = select<ShoppingBasket, number>(state =>
   *   state.products.reduce((acc, cur) => acc + cur.price, 0)
   * )
   */

  type Select<StateValues, ResultantType> = (
    selectFunction: (state: StateValues) => ResultantType,
    dependencies?: Array<(state: any) => any>
  ) => never;

  function select<StateValues = any, ResultantType = any>(
    selectFunction: (state: StateValues) => ResultantType,
    dependencies?: Array<(state: any) => any>
  ): Select<StateValues, ResultantType>;

  /**
   * https://github.com/ctrlplusb/easy-peasy#storeprovider
   */

  class StoreProvider<Model = any> extends React.Component<{
    store: Store<Model>;
  }> {}

  /**
   * https://github.com/ctrlplusb/easy-peasy#usestoremapstate-externals
   *
   * Example usage:
   *
   * const todos = useStore<Model, Array<string>>(state => state.todos.items);
   *
   * const { totalPrice, netPrice } = useStore<Model, { totalPrice: number; netPrice: number; }>(state => ({
   *   totalPrice: state.basket.totalPrice,
   *   netPrice: state.basket.netPrice
   * }));
   */

  function useStore<Model = any, StateValue = any>(
    mapState: (state: ModelValues<Model>) => StateValue,
    externals?: Array<any>
  ): StateValue;

  /**
   * https://github.com/ctrlplusb/easy-peasy#useactionmapaction
   *
   * Example usage:
   *
   * const addTodo = useAction<Model, string>(dispatch => dispatch.todos.add);
   *
   * const { saveTodo, removeTodo } = useAction<Model, {
   *   saveTodo: (todo: string) => void;
   *   removeTodo: (todo: string) => void;
   * }>(dispatch => ({
   *   saveTodo: dispatch.todos.save,
   *   removeTodo: dispatch.todo.toggle
   * }));
   */

  function useAction<Model = any, ActionPayload = any>(
    mapAction: (dispatch: Dispatch<Model>) => ActionFunction<ActionPayload>
  ): ActionFunction<ActionPayload>;
}
