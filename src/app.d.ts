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

interface UserModel extends RecordModel {
  firstName: string,
  lastName: string,
  avatar: string,
  school: string,
  organization: string,
  accountType: 'student' | 'schoolAdmin' | 'organizationAdmin'
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

interface ListingModel extends RecordModel {
  title: string,
  description: string,
  organization: string,
  confirmedSchools: string[],
  requestedSchools: string[],
  location: string,
  type: 'full-time' | 'part-time' | 'volunteer' | 'internship',
  applicationDeadline: string,
  applicationLimit: number,
  published: boolean,
  archived: boolean,
  thumbnail: string,
  created: string,
  updated: string
}

interface ApplicationModel extends RecordModel {
  listing: string,
  student: string,
  resume: string,
  attachedMessage: string,
  status: 'submitted' | 'reviewed' | 'accepted' | 'rejected',
  expand: {
    student: StudentModel
  }
}

export { UserModel, FormResponse, Dictionary, OrganizationModel, SchoolModel, ListingModel, ApplicationModel };
