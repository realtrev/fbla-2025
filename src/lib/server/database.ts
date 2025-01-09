import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { User } from '$lib/types';

export const database = new PocketBase(PUBLIC_POCKETBASE_URL);

export const currentUser = writable(pb.authStore.record as User);