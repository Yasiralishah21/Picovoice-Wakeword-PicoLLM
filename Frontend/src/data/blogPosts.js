export const BLOG_POSTS = [
  {
    id: 1,
    slug: "shipping-voice-models-to-production",
    date: "May 28, 2026",
    title: "What we learned shipping voice models to production",
    excerpt:
      "Notes from our team on testing latency, handling edge cases, and keeping deployments stable at scale.",
    readMins: "6 min read",
    accent: "#5B6BF8",
    content: [
      "Shipping a voice model to production is less about the model itself and more about everything around it — latency budgets, failure modes, and how gracefully your system degrades when something goes wrong.",
      "We started by defining clear thresholds: activation time under 200ms, false positive rate below 1%, and a rollback path that doesn't require a full app redeploy. Those constraints shaped every decision that followed.",
      "Testing in real environments mattered more than lab benchmarks. Noisy kitchens, moving cars, and open-plan offices surfaced issues our synthetic datasets never caught. We built a small set of field recordings and re-ran them before every release.",
      "The biggest lesson: treat the model as one component in a pipeline, not the whole product. Logging, monitoring, and a simple way to swap model versions without downtime ended up being just as important as accuracy scores.",
    ],
  },
  {
    id: 2,
    slug: "on-device-inference-tradeoffs",
    date: "May 14, 2026",
    title: "On-device inference without the usual trade-offs",
    excerpt:
      "Why keeping data local doesn't have to mean slower responses or heavier hardware requirements.",
    readMins: "4 min read",
    accent: "#22d3ee",
    content: [
      "On-device inference gets a bad reputation — people assume it means slower, dumber, or more expensive hardware. That hasn't been our experience.",
      "Modern quantized models can run in under 100KB with sub-100ms activation on a Raspberry Pi 4. The trick is picking the right architecture upfront rather than trying to compress a cloud-sized model after the fact.",
      "Privacy is the obvious win, but latency is underrated. No round trip to a server means your assistant feels instant, even on a spotty connection.",
      "The trade-off we do accept: training still happens off-device. But once the model is trained, deployment is lightweight and your users' voice data never leaves the device unless they explicitly opt in.",
    ],
  },
  {
    id: 3,
    slug: "home-assistant-setup",
    date: "Apr 30, 2026",
    title: "Hooking up Home Assistant in an afternoon",
    excerpt:
      "A practical setup guide for automations, scenes, and custom triggers — no deep ML background needed.",
    readMins: "5 min read",
    accent: "#a78bfa",
    content: [
      "Home Assistant is one of the most common integrations we see, and for good reason — it's flexible, well-documented, and the community has already solved most of the hard problems.",
      "Start with the OpenWakeWord add-on or a direct MQTT bridge depending on your setup. MQTT is simpler if you're already running a broker; the add-on is better if you want everything in one place.",
      "Define your wake word trigger as a binary sensor, then wire it to whatever automation you need — lights, media, notifications, or a custom script. Most setups take under an hour once the model is trained.",
      "One tip: test your automations with a recorded audio clip before relying on live activation. It saves a lot of debugging time when something doesn't fire the way you expected.",
    ],
  },
  {
    id: 4,
    slug: "reducing-false-activations",
    date: "Apr 12, 2026",
    title: "Cutting false activations without retraining from scratch",
    excerpt:
      "Practical threshold tuning and negative sample collection that actually moves the needle.",
    readMins: "7 min read",
    accent: "#5B6BF8",
    content: [
      "False activations are the number one complaint we hear after deployment. The good news: you often don't need a full retrain to fix them.",
      "Start by collecting negative samples from the actual environment — TV audio, background conversations, similar-sounding words. Even 30 minutes of recordings helps.",
      "Threshold tuning is underrated. Dropping sensitivity by 0.05 can eliminate most false triggers with minimal impact on true activations. Log both metrics side by side before and after.",
    ],
  },
  {
    id: 5,
    slug: "voice-ui-design-patterns",
    date: "Mar 25, 2026",
    title: "Voice UI patterns that don't frustrate users",
    excerpt:
      "Short prompts, clear feedback, and knowing when not to use voice at all.",
    readMins: "5 min read",
    accent: "#22d3ee",
    content: [
      "Voice works best for short, hands-busy tasks. Long conversational flows feel magical in demos and painful in daily use.",
      "Always give auditory or visual confirmation that the system heard you. Silence after a wake word is the fastest way to lose trust.",
      "Offer an escape hatch — a button, a timeout, or a cancel phrase. Users need to know they're not stuck in a loop.",
    ],
  },
  {
    id: 6,
    slug: "team-notes-march-2026",
    date: "Mar 8, 2026",
    title: "Team notes — March 2026",
    excerpt:
      "A quick roundup of what we shipped, what broke, and what we're looking at next.",
    readMins: "3 min read",
    accent: "#a78bfa",
    content: [
      "March was mostly infrastructure — faster model export, better docs for the training pipeline, and a long-overdue cleanup of our example projects.",
      "We also fixed a bug where certain accents were underrepresented in the default test set. If you noticed uneven performance across speakers, that was likely why.",
      "Coming next: a simpler CLI for batch testing and a visual dashboard for comparing model versions side by side.",
    ],
  },
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
