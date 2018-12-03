import {
  select,
  effect,
  createStore,
  Select,
  Effect,
  Action
} from "easy-peasy";
import { delay } from "./toDoService";
import { Param1, Overwrite, Omit } from "type-zoo";
import Redux from "redux";

interface ClientType {
  id: number;
  name: string;
}

interface SiteType {
  id: number;
  name: string;
}

interface LoginCredentials {
  id: string;
}

interface LoginResponse {
  userName: string;
  name: string;
  id: string;
  isError: boolean;
  ok: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  permissions: {
    GlobalAdmin?: boolean;
    Admin?: boolean;
    [k: string]: boolean | undefined;
  };
}

interface DeepShape {
  deepValue: boolean;
}

interface ModelShape {
  ready: boolean;
  logoBaseUrl: string;

  user: User;

  clients: ClientType[];
  selectedClient: {
    id: number;
    sites: SiteType[];
  };

  deep1: {
    deep2: DeepShape;
  };
}

interface ModelSelector {
  isAuthenticated: boolean;
}

interface ModelActionShape {
  deep1: {
    deep2: {
      toggle: Action<DeepShape, undefined>;
    };
  };

  isAuthenticated: Select<{ user: { id: number } }, boolean>;

  // Actions
  login: Effect<Model, LoginCredentials>;
  logout: Action<ModelShape & ModelSelector, undefined>;

  // Events
  _handleLogin: Action<ModelShape & ModelSelector, LoginResponse>;
}

type Model = ModelShape & ModelActionShape;

type FnModel = FunctionProperties<Model>;
type ValModel = NonFunctionProperties<Model>;

export function fv(f: FnModel, v: ValModel) {}

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
type IsMoreThanOneParam<Func> = Func extends (
  a: any,
  b: undefined,
  ...args: Array<any>
) => any
  ? Func
  : never;
type FunctionWithoutFirstParam<F> = IsMoreThanOneParam<F> extends Function
  ? (payload: Param1<F>) => void
  : () => void;
type FunctionsWithoutFirstParam<T> = {
  [k in keyof T]: FunctionWithoutFirstParam<T[k]>
};
type ActionPrimitive = number | string | boolean | null | symbol;
type ActionFunction<ActionPayload = any> = ActionPayload extends undefined
  ? () => void
  : ActionPayload extends ActionPrimitive | Array<ActionPrimitive>
  ? (payload: ActionPayload) => void
  : ActionPayload;

// given a model, get the state shapes of any reducer(...)s
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type ReducerStateShapes<Model> = {
  [K in keyof FunctionProperties<Model>]: FunctionReturnType<
    FunctionProperties<Model>[K]
  >
};

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
type ModelActions<Model> = {
  [k in keyof Model]: Omit<
    FunctionsWithoutFirstParam<FunctionProperties<Model[k]>>,
    keyof ReducerValues<Model>[k]
  >
};

// given an easy-peasy Model, extract just the state values, minus reducers and select(...)s
type MutableModelValues<Model> = {
  [k in keyof Model]: Omit<
    NonFunctionProperties<Model[k]>,
    keyof ReducerValues<Model>[k]
  >
};

// given an easy-peasy Model, extract just the state values
type ModelValues<Model> = MutableModelValues<Model> & ReducerValues<Model>;

// easy-peasy's decorated Redux dispatch() (e.g. dispatch.todos.insert(item); )
type Dispatch<Model = any> = Redux.Dispatch & ModelActions<Model>;

type MV = ModelValues<Model>;
type MA = ModelActions<Model>;
type D = Dispatch<Model>;

export function s(mv: MV, ma: MA, d: D) {}

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay(100);
  return {
    ok: true,
    isError: false,
    id: "id",
    userName: "username",
    name: "name"
  };
}

function clearLoginData() {
  // empty
}

export const Store = createStore({
  ready: false,
  logoBaseUrl: "",

  user: {
    id: 0,
    name: "",
    email: "",
    permissions: {}
  },

  clients: [],
  selectedClient: {
    id: 0,
    sites: []
  },

  deep1: {
    deep2: {
      deepValue: false,
      toggle: (state: DeepShape) => {
        state.deepValue = !state.deepValue;
      }
    }
  },

  isAuthenticated: select(s => !!s.user.id),
  login: effect(async (dispatch, credentials) => {
    const results = await login(credentials);
    (dispatch as any)._handleLogin(results);
  }),
  logout: (state: any) => {
    clearLoginData();
    return {
      ...state,
      clients: [],
      selectedClient: { id: 0, sites: [] },
      user: { id: 0, name: "", email: "", permissions: {} }
    };
  },

  _handleLogin: (state: Model, p: LoginResponse) => {
    if (p.isError) {
    } else {
      // Update state
      state.user.email = p.userName;
      state.user.id = Number(p.id);
      state.user.name = p.name;
    }
  }
});
