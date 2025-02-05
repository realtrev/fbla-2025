// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthRecord, RecordModel } from 'pocketbase';
import type PocketBase from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      pb: PocketBase;
      user: AuthRecord | null;
      school: SchoolModel | null;
      organization: OrganizationModel | null;
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

interface OrganizationModel extends RecordModel {
  name: string,
  description: string,
  email: string
}

interface SchoolModel extends RecordModel {
  name: string,
  description: string,
  emailDomain: string,
  website: string,
  contact: string,
  location: string,
  logo: string,
  created: string,
  updated: string
}

export { FormResponse, Dictionary, OrganizationModel, SchoolModel };
