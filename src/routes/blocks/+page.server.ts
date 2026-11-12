import { getBlockCategories } from "$lib/blocks.js";

export const load = () => ({ categories: getBlockCategories() });
