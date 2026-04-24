<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import VisionSection from '$lib/components/VisionSection.svelte';
	import VospaOrigin from '$lib/components/VospaOrigin.svelte';
	import ThreePlanes from '$lib/components/ThreePlanes.svelte';
	import WorkingManual from '$lib/components/WorkingManual.svelte';
	import DevelopmentMap from '$lib/components/DevelopmentMap.svelte';
	import ReferenceImplementation from '$lib/components/ReferenceImplementation.svelte';
	import EcosystemSection from '$lib/components/EcosystemSection.svelte';
	import SignupForm from '$lib/components/SignupForm.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { data } = $props();
</script>

<Hero />
<ProblemSection />
<VisionSection />
<VospaOrigin />
<ThreePlanes />
<WorkingManual entries={data.entries} />
<DevelopmentMap map={data.devMap} />
<ReferenceImplementation />
<EcosystemSection />
<SignupForm />
<SiteFooter />
