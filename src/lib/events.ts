import { track } from "@vercel/analytics";

type EventName =
	| "copy_install_command"
	| "copy_block_cli"
	| "copy_block_code"
	| "copy_agent_prompt";

type AllowedPropertyValues = string | number | boolean | null;

export interface Event {
	name: EventName;
	properties?: Record<string, AllowedPropertyValues>;
}

export function trackEvent({ name, properties }: Event): void {
	track(name, properties);
}
