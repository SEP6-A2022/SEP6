import { writable } from 'svelte/store';
import type { IJwtData } from './routes/common/types';

export interface loggedType {
    content: IJwtData | undefined,
    token: string | undefined
}

const logged : loggedType = {
    content: undefined,
    token: undefined
}

export const loggedInUser = writable(logged);