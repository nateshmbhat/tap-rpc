import { writable } from "svelte/store";

export interface SnackBarModel {
	message: string | string[];
	durationsInMillis: number;
	isActive: boolean;
	sticky: boolean;
}

function createSnackBarStore() {
	const { subscribe, set, update } = writable<SnackBarModel>({
		message: 'testing',
		durationsInMillis: 3000,
		isActive: false,
		sticky: false
	});
	return {
		subscribe,
		showSnackbar: ({ message, durationInSeconds, sticky }: { message: string | string[], durationInSeconds?: number, sticky?: boolean }) =>
			update((store) => {
				return ({
					...store, message,
					durationsInMillis: (durationInSeconds ?? 3) * 1000,
					isActive: true,
					sticky: sticky ?? false
				});
			}),
		closeSnackbar: () => update(store => ({ ...store, isActive: false }))
	}
}


export const snackBarStore = createSnackBarStore();