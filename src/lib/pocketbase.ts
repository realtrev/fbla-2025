import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, { type AuthRecord } from 'pocketbase';
import { writable } from 'svelte/store';
import type { OrganizationModel, SchoolModel } from '../app';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const currentUser = writable(pb.authStore.record as AuthRecord);

export const currentSchool = writable(null as SchoolModel);

export const currentOrganization = writable(null as OrganizationModel);