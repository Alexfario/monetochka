import { observable, action, computed, makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';
import * as Localization from 'expo-localization';
import { Category, User } from '../constants/interfaces';

const locale = Localization.locale;

class Store {
  @observable categories: Category[] = [];
  @observable userId: string = '';
  @observable lang: string = locale;

  constructor() {
    makeAutoObservable(this);
  }

  @action setLoggedInUser = (user: User) => {
    this.userId = user._id;
    this.categories = user.categories;
  }

  @action changeCategories = (categories: Category[]) => {
    this.categories = categories;
  }

  @action changeLang = (lang: string) => {
    this.lang = lang;
  }

  @computed get allCategories () {
    return this.categories;
  }

  @computed get currentUserId () {
    return this.userId;
  }

  @computed get currentLang () {
    return this.lang;
  }
}

const store = new Store();

export const GlobalStoreContext = createContext(store);

export const useStore = () => {
  return useContext<typeof store>(GlobalStoreContext);
};

export default store;