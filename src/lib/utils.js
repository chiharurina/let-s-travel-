import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// why: deterministic merge for Tailwind classes
export function cn(...inputs) { return twMerge(clsx(inputs)); }
