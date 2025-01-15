// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthRecord } from 'pocketbase';
import type PocketBase from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      pb: PocketBase;
      user: AuthRecord | null;
    }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface FormResponse {
  type: string;
  status: number;
  data: any[];
  location?: string;
}

interface Dictionary<T> {
  [key: string]: T
}

export { FormResponse, Dictionary };
