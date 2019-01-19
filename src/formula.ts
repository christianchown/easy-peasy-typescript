import { select, effect, createStore, Select, Effect, Action } from 'easy-peasy';
import { delay } from './toDoService';
import { Param1, Overwrite, Omit } from 'type-zoo';
import Redux from 'redux';

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

  clients: Array<ClientType>;
  selectedClient: {
    id: number;
    sites: Array<SiteType>;
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
  logout: Action<ModelShape & ModelSelector, void>;

  // Events
  _handleLogin: Action<ModelShape & ModelSelector, LoginResponse>;
}

export type Model = ModelShape & ModelActionShape;

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay(100);
  return {
    ok: true,
    isError: false,
    id: 'id',
    userName: 'username',
    name: 'name',
  };
}

function clearLoginData() {
  // empty
}

export const Store = createStore<Model>({
  ready: false,
  logoBaseUrl: '',

  user: {
    id: 0,
    name: '',
    email: '',
    permissions: {},
  },

  clients: [],
  selectedClient: {
    id: 0,
    sites: [],
  },

  deep1: {
    deep2: {
      deepValue: false,
      toggle: (state: DeepShape) => {
        state.deepValue = !state.deepValue;
      },
    },
  },

  isAuthenticated: select(s => !!s.user.id),
  login: effect(async (dispatch, credentials) => {
    const results = await login(credentials);
    dispatch._handleLogin(results);
  }),
  logout: state => {
    clearLoginData();
    return {
      ...state,
      clients: [],
      selectedClient: { id: 0, sites: [] },
      user: { id: 0, name: '', email: '', permissions: {} },
    };
  },

  _handleLogin: (state: ModelShape, p: LoginResponse) => {
    if (p.isError) {
      // empty
    } else {
      // Update state
      state.user.email = p.userName;
      state.user.id = Number(p.id);
      state.user.name = p.name;
    }
  },
});
