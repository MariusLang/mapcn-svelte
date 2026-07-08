<script lang="ts" module>
	import { getContext, setContext } from "svelte";

	export type PageHeaderAlign = "center" | "left";
	export type PageHeaderSize = "default" | "sm";

	const pageHeaderContextKey = Symbol("page-header");

	export interface PageHeaderContext {
		align: () => PageHeaderAlign;
		size: () => PageHeaderSize;
	}

	export function setPageHeaderContext(context: PageHeaderContext) {
		setContext(pageHeaderContextKey, context);
	}

	export function getPageHeaderContext() {
		return (
			getContext<PageHeaderContext>(pageHeaderContextKey) ?? {
				align: () => "center",
				size: () => "default",
			}
		);
	}
</script>

<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		class?: string;
		align?: PageHeaderAlign;
		size?: PageHeaderSize;
		children?: import("svelte").Snippet;
	}

	const { class: className, align = "center", size = "default", children }: Props = $props();

	setPageHeaderContext({
		align: () => align,
		size: () => size,
	});
</script>

<section
	class={cn(
		"container mx-auto flex w-full max-w-6xl flex-col",
		size === "sm" ? "gap-3 py-14 md:py-18" : "gap-4 py-16 md:py-20 lg:py-24 lg:pb-20",
		align === "center" ? "items-center text-center" : "items-start text-left",
		className
	)}
>
	{@render children?.()}
</section>
