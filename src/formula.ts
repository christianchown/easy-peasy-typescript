import {
  select,
  effect,
  createStore,
  Select,
  Effect,
  Action,
  ModelActions,
  ModelValues,
  Dispatch
} from "easy-peasy";
import { delay } from "./toDoService";

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

interface ModelShape {
  ready: boolean;
  logoBaseUrl: string;

  user: User;

  clients: ClientType[];
  selectedClient: {
    id: number;
    sites: SiteType[];
  };
}

interface ModelSelector {
  isAuthenticated: boolean;
}

interface ModelActionShape {
  isAuthenticated: Select<{ user: { id: number } }, boolean>;

  // Actions
  login: Effect<Model, LoginCredentials>;
  logout: Action<ModelShape & ModelSelector, void>;

  // Events
  _handleLogin: Action<ModelShape & ModelSelector, LoginResponse>;
}

type Model = ModelShape & ModelActionShape;

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

export const Store = createStore<Model>({
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

  isAuthenticated: select(s => !!s.user.id),
  login: effect(async (dispatch, credentials) => {
    const results = await login(credentials);
    dispatch(dispatch as any)._handleLogin(results);
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

  _handleLogin: (state: ModelShape, p: LoginResponse) => {
    if (p.isError) {
    } else {
      // Update state
      state.user.email = p.userName;
      state.user.id = Number(p.id);
      state.user.name = p.name;
    }
  }
});
