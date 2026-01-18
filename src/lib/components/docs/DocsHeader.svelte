<script lang="ts">
	const { title, description } = $props<{
		title: string;
		description: string;
	}>();
</script>

<div class="space-y-3">
	<h1 class="text-foreground text-3xl font-semibold tracking-tight">{title}</h1>
	<p class="text-muted-foreground text-lg leading-relaxed">
		{description}
	</p>
</div>
