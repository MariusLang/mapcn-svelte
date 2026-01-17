<script lang="ts">
	import { cn } from "$lib/utils";
	import { Heart, MapPin } from "lucide-svelte";
	import { Button } from "$lib/registry/ui/button";
	import { Separator } from "$lib/registry/ui/separator/index";
	import * as Tooltip from "$lib/registry/ui/tooltip/index.js";
	import GitHubButton from "$lib/components/GitHubButton.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	//import { CommandSearch } from "$lib/components/CommandSearch.svelte";

	interface Props {
		class?: string;
		children?: import("svelte").Snippet;
	}

	const { class: className, children }: Props = $props();
</script>

<header class={cn("w-full py-4", className)}>
	<nav class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			{#if children}
				{@render children()}
			{/if}
			<a href="/" class="flex items-center gap-1.5 transition-opacity hover:opacity-80">
				<MapPin class="size-4 text-orange-600" />
				<span class="font-semibold tracking-tight">mapcn-svelte</span>
			</a>
		</div>
		<div class="flex h-4.5 items-center gap-2">
			<!--<CommandSearch />-->
			<Separator orientation="vertical" class="hidden sm:block" />
			<Tooltip.Provider>
				<!--<Tooltip.Root>
					<Tooltip.Trigger>
						<Button variant="ghost" size="sm">
							<a
								href="https://github.com/sponsors/MariusLang"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Heart class="size-4 text-pink-500" />
								<span class="hidden sm:inline">Sponsor</span>
							</a>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Sponsor this project</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<Separator orientation="vertical" />-->
				<GitHubButton />
				<Separator orientation="vertical" />
				<ThemeToggle />
			</Tooltip.Provider>
		</div>
	</nav>
</header>

<!--import { Heart, MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubButton } from "@/components/github-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandSearch } from "@/components/command-search";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  leftContent?: React.ReactNode;
}

export function Header({ className, leftContent }: HeaderProps) {
  return (
    <header className={cn("w-full h-16", className)}>
      <nav className="flex size-full items-center justify-between container">
        <div className="flex items-center gap-4">
          {leftContent}
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <MapPin className="size-4" />
            <span className="font-semibold tracking-tight">mapcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 h-4.5">
          <CommandSearch />
          <Separator orientation="vertical" className="hidden sm:block" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/sponsors/AnmolSaini16"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="size-4 text-pink-500" />
                  <span className="hidden sm:inline">Sponsor</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sponsor this project</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <GitHubButton />
          <Separator orientation="vertical" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
} -->
