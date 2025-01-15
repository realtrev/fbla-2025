import { browser } from '$app/environment';
import { get, writable, type Subscriber, type Updater, type Writable } from 'svelte/store';

interface CookieCustomization {
  essential: boolean;
  statistics: boolean;
  marketing: boolean;
}

class LocalStore<T> {
  private key: string;
  private initialValue: T;
  private store: Writable<T>;
  private autoSave: boolean;

  private static stores: LocalStore<any>[] = [];

  constructor(key: string, initialValue: T, autoSave = true) {
    this.key = key;
    this.initialValue = initialValue;
    this.store = writable(initialValue);
    this.autoSave = autoSave;

    LocalStore.stores.push(this);
  }

  get value() {
    return this.store;
  }

  save(key: string = this.key) {
    this.saveToStorage(key);
  }

  subscribe(run: Subscriber<T>, invalidate?: () => void) {
    return this.store.subscribe(run, invalidate);
  }

  set(value: T) {
    if (!this.autoSave) {
      console.warn(`Setting value of ${this.key} without saving to localStorage. Call save() manually.`);
    }
    this.store.set(value);
  }

  update(updater: Updater<T>) {
    this.store.update(updater);
  }

  clear() {
    this.store.set(this.initialValue);
    this.saveToStorage();
  }

  private loadFromStorage(key: string = this.key, initialValue: T = this.initialValue) {
    if (browser) {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        this.store.set(JSON.parse(storedValue));
      } else {
        this.store.set(initialValue);
        this.saveToStorage(key, initialValue);
      }
    }
  }

  private saveToStorage(key: string = this.key, value: T = get(this.store)) {
    if (browser) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
        console.error(`Failed to save ${key} to localStorage`);
        window.localStorage.removeItem(key);
      }
    }
  }

  static clearAll() {
    LocalStore.stores.forEach((store) => {
      store.clear();
    });
  }

  static loadAll() {
    LocalStore.stores.forEach((store) => {
      store.loadFromStorage();

      if (!store.autoSave) {
        return;
      }

      store.subscribe((value) => {
        store.saveToStorage(store.key, value);
      });
    });
  }
}

const cookiePreferences = new LocalStore('cookiePreferences', {
  essential: true,
  statistics: false,
  marketing: false,
} as CookieCustomization);

const cookiesAccepted = new LocalStore('cookiesAccepted', false);

const globalTheme = new LocalStore('globalTheme', 'light' as 'light' | 'dark');

export { LocalStore, cookiePreferences, cookiesAccepted, globalTheme };