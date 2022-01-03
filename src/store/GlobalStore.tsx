import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { Category } from '@/models/categoriesModel';
import { Order } from '@/models/orderModel';
import { User } from '@/models/userModel';
import { getData } from '@/utils/fetchData';

import ActionMap from './actionMap';

import { ModalItem, Notify } from '@/types';
import { CartItem } from '@/types/CartItem';

export enum AuthEvent {
  LOGIN = 'AUTH/LOGIN',
  ALREADY_LOGGEDIN = 'AUTH/ALREADY_LOGGEDIN',
  LOGOUT = 'AUTH/LOGOUT',
}

export enum NotificationEvent {
  NOTIFY = 'NOTIFICATION/NOTIFY',
}

export enum ModalEvent {
  ADD = 'MODAL/ADD',
}

export enum OrdersEvent {
  ADD = 'ORDERS/ADD',
}

export enum UsersEvent {
  ADD = 'USERS/ADD',
}

export enum CategoriesEvent {
  ADD = 'CATEGORIES/ADD',
}

export enum CartEvent {
  ADD = 'CART/ADD',
}

type Auth = {
  token: string;
  user: User;
};

export type GlobalState = {
  notify?: Notify;
  auth?: Auth;
  cart: CartItem[];
  orders: Order[];
  users: User[];
  categories: Category[];
  modal: ModalItem[];
};

type Messages = {
  [AuthEvent.LOGIN]: {
    auth: Auth;
  };
  [AuthEvent.ALREADY_LOGGEDIN]: {
    auth: Auth;
  };
  [AuthEvent.LOGOUT]: Record<string, unknown>;
  [NotificationEvent.NOTIFY]: {
    notify: Notify;
  };
  [CategoriesEvent.ADD]: {
    categories: Category[];
  };
  [OrdersEvent.ADD]: {
    orders: Order[];
  };
  [UsersEvent.ADD]: {
    users: User[];
  };
  [CartEvent.ADD]: {
    cart: CartItem[];
  };
  [ModalEvent.ADD]: {
    modal: ModalItem[];
  };
};

type Actions = ActionMap<Messages>[keyof ActionMap<Messages>];

const globalStateReducer = (
  state: GlobalState,
  action: Actions
): GlobalState => {
  switch (action.type) {
    case AuthEvent.LOGIN:
      return {
        ...state,
        auth: { ...action.payload.auth },
      };
    case AuthEvent.ALREADY_LOGGEDIN:
      return {
        ...state,
        auth: { ...action.payload.auth },
      };
    case AuthEvent.LOGOUT:
      return {
        ...state,
        auth: undefined,
      };
    case CategoriesEvent.ADD:
      return {
        ...state,
        categories: [...action.payload.categories],
      };
    case CartEvent.ADD:
      return {
        ...state,
        cart: [...action.payload.cart],
      };
    case OrdersEvent.ADD:
      return {
        ...state,
        orders: [...action.payload.orders],
      };
    case UsersEvent.ADD:
      return {
        ...state,
        users: [...action.payload.users],
      };
    case NotificationEvent.NOTIFY:
      return {
        ...state,
        notify: { ...action.payload.notify },
      };
    case ModalEvent.ADD:
      return {
        ...state,
        modal: [...action.payload.modal],
      };
  }
};

const GlobalStateContext = createContext<Partial<GlobalState>>({});
const GlobalDispatchContext = createContext<Dispatch<Actions>>(() => null);

export interface GlobalStateProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalStateReducer, {
    modal: [],
    notify: {},
    auth: undefined,
    cart: [],
    orders: [],
    users: [],
    categories: [],
  });

  const { cart, auth } = state;

  useEffect(() => {
    getData('categories').then((res) => {
      if (res.err)
        return dispatch({
          type: NotificationEvent.NOTIFY,
          payload: {
            notify: { error: res.err },
          },
        });

      dispatch({
        type: CategoriesEvent.ADD,
        payload: {
          categories: res.categories,
        },
      });
    });

    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      getData('auth/accessToken').then((res) => {
        if (res.err) return localStorage.removeItem('firstLogin');
        dispatch({
          type: AuthEvent.LOGIN,
          payload: {
            auth: {
              token: res.access_token,
              user: res.user,
            },
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    const __next__cart01__devat = JSON.parse(
      localStorage.getItem('__next__cart01__devat') || ''
    );

    if (__next__cart01__devat)
      dispatch({ type: CartEvent.ADD, payload: __next__cart01__devat });
  }, []);

  useEffect(() => {
    localStorage.setItem('__next__cart01__devat', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth && auth.token) {
      getData('order', auth.token).then((res) => {
        if (res.err)
          return dispatch({
            type: NotificationEvent.NOTIFY,
            payload: { notify: { error: res.err } },
          });

        dispatch({ type: OrdersEvent.ADD, payload: res.orders });
      });

      if (auth.user.role === 'admin') {
        getData('user', auth.token).then((res) => {
          if (res.err)
            return dispatch({
              type: NotificationEvent.NOTIFY,
              payload: { notify: { error: res.err } },
            });

          dispatch({ type: OrdersEvent.ADD, payload: res.users });
        });
      }
    } else {
      dispatch({ type: OrdersEvent.ADD, payload: { orders: [] } });
      dispatch({ type: UsersEvent.ADD, payload: { users: [] } });
    }
  }, [auth]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
