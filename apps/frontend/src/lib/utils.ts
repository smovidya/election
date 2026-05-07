import { State } from "@/lib/svelte-utils.svelte";
import type { SupportedLanguage } from "@repo/constants";
import { type ClassValue, clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


const _locale = new State<SupportedLanguage>("th");
if (typeof window !== "undefined") {
	_locale.current = localStorage.getItem("locale") as any ?? "th";
}
export const locale = {
	get current() {
		return _locale.current;
	},
	set current(newValue) {
		localStorage.setItem("locale", newValue);
		_locale.current = newValue;
		for (const r of reactInvalidators) {
			r();
		}
	}
};


let reactInvalidators: (() => any)[] = [];

export function useLocale() {
	const [_, invalidate] = useState(0);
	useEffect(() => {
		const fn = () => {
			invalidate(i => i + 1);
		};
		reactInvalidators.push(fn);

		return () => {
			reactInvalidators = reactInvalidators.filter(it => it === fn);
		};
	}, []);

	function setValue(newValue: SupportedLanguage) {
		locale.current = newValue;
	}

	return [locale.current, setValue] as const;
}