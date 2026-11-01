import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const actor = (name: string) => document.querySelector<SVGGElement>(`[data-a="${name}"]`);
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/* ---------- Camera: which part of the world is on screen ---------- */

function setUpCamera(reducedMotion: boolean) {
    const scenes = gsap.utils.toArray<HTMLElement>("[data-stage] .scene");
    const sections = gsap.utils.toArray<HTMLElement>("[data-scene]");
    const readouts = gsap.utils.toArray<HTMLElement>("[data-elevation]");
    const railLinks = gsap.utils.toArray<HTMLElement>("[data-rail-link]");
    const elevations = sections.map((section) => Number(section.dataset.elev));

    let holds: { start: number; end: number }[] = [];
    let viewHeight = 0, sceneHeight = 0, portrait = false;
    let camera = -1, activeStop = -1;

    function measure() {
        viewHeight = window.innerHeight;
        sceneHeight = scenes[0].offsetHeight;
        portrait = window.innerWidth < viewHeight;
        // The camera holds on a scene while its section fills the screen, then glides to the next.
        holds = sections.map((section) => {
            const box = section.getBoundingClientRect();
            const top = box.top + window.scrollY;
            const start = top - viewHeight * 0.15;
            return { start, end: Math.max(start, top + box.height - viewHeight * 0.85) };
        });
        holds[0].start = 0;
        camera = -1;
    }

    function cameraFor(scrollY: number) {
        for (let i = 0; i < holds.length; i++) {
            if (scrollY <= holds[i].end) {
                if (i === 0 || scrollY >= holds[i].start) return i;
                const t = clamp01((scrollY - holds[i - 1].end) / (holds[i].start - holds[i - 1].end));
                return i - 1 + t * t * (3 - 2 * t);
            }
        }
        return holds.length - 1;
    }

    function render(position: number) {
        // On portrait the summit sits low on the screen so the hiker shows below the intro card.
        const focus = portrait ? lerp(0.85, 0.62, clamp01(position)) : 0.5;
        scenes.forEach((scene, index) => {
            const y = Math.round((index - position) * sceneHeight + viewHeight * focus - sceneHeight / 2);
            const onScreen = y < viewHeight && y + sceneHeight > 0;
            scene.style.visibility = onScreen ? "visible" : "hidden";
            if (onScreen) scene.style.transform = `translate3d(0, ${y}px, 0)`;
        });

        const low = Math.floor(position), high = Math.min(low + 1, elevations.length - 1);
        // Rounded while moving so the digits don't flicker, exact once stopped at a scene.
        const elevation = position === low ? elevations[low] : Math.round(lerp(elevations[low], elevations[high], position - low) / 10) * 10;
        const text = `${elevation.toLocaleString("en-US")} ft`;
        readouts.forEach((readout) => { readout.textContent = text; });

        const stop = Math.round(position);
        if (stop !== activeStop) {
            activeStop = stop;
            railLinks.forEach((link) => {
                if (Number(link.dataset.railLink) === stop) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        }
    }

    measure();
    gsap.ticker.add(() => {
        const target = cameraFor(window.scrollY);
        if (camera < 0 || reducedMotion) {
            // Reduced motion: cut straight to the nearest scene instead of panning.
            const next = reducedMotion ? Math.round(target) : target;
            if (next !== camera) render(camera = next);
        } else if (Math.abs(target - camera) > 0.0005) {
            render(camera += (target - camera) * 0.14);
        } else if (target !== camera) {
            render(camera = target);
        }
    });

    new ResizeObserver(measure).observe(document.body);
}

/* ---------- Activities: one scrubbed animation per scene ---------- */

function scrubbed(trigger: string, start = "top bottom", end = "bottom top") {
    return gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger, start, end, scrub: 0.5 },
    });
}

// A tween that calls `draw` with 0 to 1, for motion that plain properties can't describe.
function drive(draw: (t: number) => void, vars: gsap.TweenVars = {}) {
    const state = { t: 0 };
    draw(0);
    return gsap.to(state, { t: 1, duration: 1, ease: "none", ...vars, onUpdate: () => draw(state.t) });
}

// Swings a limb back and forth `count` times over the length of its timeline.
function swing(timeline: gsap.core.Timeline, name: string, svgOrigin: string, amount: number, count: number) {
    const limb = actor(name);
    gsap.set(limb, { svgOrigin });
    timeline.fromTo(limb, { rotation: -amount }, { rotation: amount, duration: 1 / count, repeat: count - 1, yoyo: true, ease: "sine.inOut" }, 0);
}

function setUpActivities() {
    // Hiking down off the summit. The hiker is mirrored, so +x walks left.
    const hike = scrubbed("#top", "top top", "bottom top").to(actor("hiker"), { x: 272, y: 192, duration: 1 }, 0);
    swing(hike, "hiker-leg-f", "10 8", 18, 8);
    swing(hike, "hiker-leg-b", "-8 8", -18, 8);

    // Climbing up the wall while the world scrolls past.
    const climb = scrubbed("#now").fromTo(actor("climber"), { y: 500 }, { y: 150, duration: 1 }, 0);
    swing(climb, "climb-arm-l", "-20 -62", 14, 10);
    swing(climb, "climb-arm-r", "20 -62", -14, 10);
    swing(climb, "climb-leg-l", "-13 10", -10, 10);
    swing(climb, "climb-leg-r", "13 10", 10, 10);

    // Biking the trail: the rider follows the drawn path, tilted to match its slope.
    const trail = document.querySelector<SVGPathElement>("#trail")!;
    const trailLength = trail.getTotalLength();
    const biker = actor("biker");
    const bikeWheels = gsap.utils.toArray<SVGGElement>('[data-a="biker"] [data-a="wheel"]');
    gsap.set(bikeWheels, { transformOrigin: "50% 50%" });
    const bike = scrubbed("#experience")
        .add(drive((t) => {
            const at = lerp(0.42, 1.04, t) * trailLength;
            const here = trail.getPointAtLength(at), ahead = trail.getPointAtLength(at + 4);
            const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI;
            // A little hop over the log.
            const hop = t > 0.27 && t < 0.43 ? Math.sin((t - 0.27) * Math.PI / 0.16) * 58 : 0;
            biker!.setAttribute("transform", `translate(${here.x} ${here.y - hop}) rotate(${angle})`);
        }), 0)
        .to(bikeWheels, { rotation: 2160, duration: 1 }, 0);
    swing(bike, "pedal-leg", "-16 -88", 14, 20);

    // The truck hauls the shipped apps across the valley.
    const truckWheels = gsap.utils.toArray<SVGGElement>('[data-a="truck"] [data-a="wheel"]');
    gsap.set(truckWheels, { transformOrigin: "50% 50%" });
    scrubbed("#projects")
        .fromTo(actor("truck"), { x: 1780 }, { x: 640, duration: 1 }, 0)
        .to(truckWheels, { rotation: -1800, duration: 1 }, 0);

    // Lifting: the arms are redrawn each frame so the elbows bend with the bar.
    const bar = actor("bar"), lifter = actor("lifter");
    const arms = [
        { side: -1, paths: gsap.utils.toArray<SVGPathElement>('[data-a="lift-arm-l"] [data-noodle]') },
        { side: 1, paths: gsap.utils.toArray<SVGPathElement>('[data-a="lift-arm-r"] [data-noodle]') },
    ];
    const bubble = actor("pr-bubble");
    gsap.set(bubble, { scale: 0, svgOrigin: "60 60" });
    scrubbed("#records", "top 90%", "bottom 30%")
        .to(bubble, { scale: 1, duration: 0.05, ease: "back.out(2.4)" }, 0.14)
        .add(drive((t) => {
            const hand = lerp(-76, -206, t);
            const elbowX = lerp(78, 72, t), elbowY = lerp(-44, -138, t);
            gsap.set(bar, { y: hand + 76 });
            gsap.set(lifter, { y: (1 - t) * 7 });
            arms.forEach(({ side, paths }) => {
                const d = `M${side * 22} -68 L${side * elbowX} ${elbowY} L${side * 52} ${hand}`;
                paths.forEach((path) => path.setAttribute("d", d));
            });
        }, { duration: 0.14, repeat: 6, yoyo: true, ease: "sine.inOut" }), 0);

    // Beach day: a rally over the net, and a frisbee for the dog.
    const ball = actor("volleyball"), playerLeft = actor("player-l"), playerRight = actor("player-r");
    const frisbee = actor("frisbee"), dog = actor("dog");
    const CATCH_AT = 0.8, CATCH_X = 1447, CATCH_Y = 330, LEAP = 150, DOG_SCALE = 1.05;
    scrubbed("#skills")
        .add(drive((t) => {
            gsap.set(ball, { x: lerp(1100, 1330, t), y: lerp(262, 232, t) - Math.sin(t * Math.PI) * 150, rotation: t * 300, transformOrigin: "50% 50%" });
            gsap.set(playerLeft, { y: -44 * clamp01(1 - t / 0.2) });
            gsap.set(playerRight, { y: -44 * clamp01((t - 0.8) / 0.2) });
        }, { duration: 0.2, repeat: 4, yoyo: true }), 0)
        .add(drive((t) => {
            const leap = t < CATCH_AT ? clamp01((t - 0.55) / (CATCH_AT - 0.55)) : 1 - (t - CATCH_AT) / (1 - CATCH_AT);
            const dogY = -LEAP * Math.sin(leap * Math.PI / 2);
            gsap.set(dog, { y: dogY });
            // The frisbee flies until the catch, then rides back down in the dog's mouth.
            const flying = clamp01(t / CATCH_AT);
            gsap.set(frisbee, {
                x: lerp(690, CATCH_X, flying),
                y: t < CATCH_AT
                    ? lerp(420, CATCH_Y, flying) - Math.sin(flying * Math.PI) * 270
                    : CATCH_Y + (dogY + LEAP) * DOG_SCALE,
                rotation: lerp(-12, 8, flying),
                transformOrigin: "50% 50%",
            });
        }), 0);

    // Scuba: the diver crosses the frame kicking, with the fish going the other way.
    const dive = scrubbed("#education")
        .fromTo(actor("diver"), { x: 1850, y: 330 }, { x: 760, y: 560, duration: 1 }, 0)
        .fromTo(actor("school"), { x: -160 }, { x: 900, y: 120, duration: 1 }, 0);
    swing(dive, "fin-a", "66 -6", 9, 20);
    swing(dive, "fin-b", "66 10", -9, 20);

    // The octopus rises to meet you at the bottom of the page.
    gsap.fromTo(actor("octopus"), { y: 280 }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: "#contact", start: "top bottom", end: "top 25%", scrub: 0.5 },
    });
}

// Resting poses for visitors who ask for reduced motion.
function poseActivities() {
    const trail = document.querySelector<SVGPathElement>("#trail")!;
    const middle = trail.getPointAtLength(trail.getTotalLength() * 0.72);
    gsap.set(actor("climber"), { y: 320 });
    actor("biker")!.setAttribute("transform", `translate(${middle.x} ${middle.y}) rotate(4)`);
    gsap.set(actor("truck"), { x: 1200 });
    gsap.set(actor("volleyball"), { x: 1230, y: 150 });
    gsap.set(actor("frisbee"), { x: 1010, y: 90 });
    gsap.set(actor("diver"), { x: 1200, y: 450 });
}

/* ---------- Components sliding onto the screen ---------- */

function setUpReveals() {
    const items = gsap.utils.toArray<HTMLElement>(".reveal");
    gsap.set(items, { autoAlpha: 0, y: 46, rotation: (index: number) => (index % 2 ? 1.6 : -1.6) });
    ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.7, stagger: 0.09, ease: "back.out(1.4)", clearProps: "transform" }),
    });
}

/* ---------- Small page behaviors ---------- */

function setUpTooltips() {
    const tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    document.body.append(tip);

    const show = (target: Element, x: number, y: number) => {
        tip.textContent = target.getAttribute("data-tip");
        tip.hidden = false;
        const maxLeft = window.innerWidth - tip.offsetWidth - 8;
        tip.style.left = `${Math.max(8, Math.min(x - tip.offsetWidth / 2, maxLeft))}px`;
        tip.style.top = `${Math.max(8, y - tip.offsetHeight - 12)}px`;
    };

    document.addEventListener("pointermove", (event) => {
        const target = (event.target as Element).closest?.("[data-tip]");
        if (target) show(target, event.clientX, event.clientY);
        else tip.hidden = true;
    });
    document.addEventListener("focusin", (event) => {
        const target = (event.target as Element).closest?.("[data-tip]");
        if (!target) return;
        const box = target.getBoundingClientRect();
        show(target, box.left + box.width / 2, box.top);
    });
    document.addEventListener("focusout", () => { tip.hidden = true; });
    window.addEventListener("scroll", () => { tip.hidden = true; }, { passive: true });
}

function setUpContactForm() {
    const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
    if (!form) return;
    const status = form.querySelector<HTMLElement>("[data-form-status]")!;
    const endpoint = form.dataset.endpoint;
    const email = form.dataset.email!;

    const openEmail = (data: FormData) => {
        const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
        const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")} (${data.get("email")})`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);

        // Until a form service is configured the button drafts an email instead.
        if (!endpoint) {
            status.textContent = "Opening your email app with this message filled in.";
            openEmail(data);
            return;
        }

        const button = form.querySelector("button")!;
        button.disabled = true;
        status.textContent = "Sending...";
        try {
            const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
            if (!response.ok) throw new Error(String(response.status));
            form.reset();
            status.textContent = "Bottle received. I'll write back soon!";
        } catch {
            status.textContent = "That didn't send, so I'm opening your email app instead.";
            openEmail(data);
        } finally {
            button.disabled = false;
        }
    });
}

function setUpMobileNav() {
    const menu = document.querySelector<HTMLDetailsElement>("[data-mobile-nav]");
    menu?.addEventListener("click", (event) => {
        if ((event.target as Element).closest("a")) menu.open = false;
    });
}

export function startJourney() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setUpCamera(reducedMotion);
    setUpTooltips();
    setUpContactForm();
    setUpMobileNav();

    // On small screens, start the commit graph on the most recent weeks.
    document.querySelectorAll("[data-scroll-end]").forEach((box) => { box.scrollLeft = box.scrollWidth; });

    if (reducedMotion) {
        poseActivities();
    } else {
        setUpActivities();
        setUpReveals();
        // Web fonts change how tall the text is, which moves every scroll trigger below it.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }
}
