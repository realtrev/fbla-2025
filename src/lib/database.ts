import { POCKETBASE_AUTH_KEY } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
pb.collection('_superusers').authWithPassword('jobfair@fbla.trevordaly.net', POCKETBASE_AUTH_KEY)
.then(() => console.log('authed'))
.catch((error) => console.error(error));