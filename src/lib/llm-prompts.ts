export const skillSource = "MariusLang/mapcn-svelte --skill mapcn-svelte";

export const mapInstallCommand = "npx shadcn-svelte@latest add https://mapcn-svelte.dev/r/map.json";

const skillRawUrl =
	"https://raw.githubusercontent.com/MariusLang/mapcn-svelte/main/skills/mapcn-svelte";

export const mapInstallAgentPrompt = `Install the MapCN Svelte agent skill with npx skills add ${skillSource} -y and read its SKILL.md. If skill installation is unavailable, read ${skillRawUrl}/SKILL.md and fetch its references from the same folder. Then run ${mapInstallCommand} and add a basic map example following the skill's instructions. When you're done, offer to look through the project and suggest where other maps or blocks would fit. Build additional examples only if I ask.`;
