// All of the copy and settings for the journey page live here.

export const links = {
    github: "https://github.com/SeanG-rsd",
    linkedin: "https://www.linkedin.com/in/seangutmann/",
    instagram: "https://www.instagram.com/gutmann.sean/",
    email: "seagut20@gmail.com",
};

// Set these to your real usernames to turn on the widgets. While one is null the
// widget shows labelled sample data in `astro dev` and is left out of the production build.
export const handles = {
    github: "SeanG-rsd",
    leetcode: "Seagut20",
    wakatime: "SeanGut",
};

// Elevation readout (ft) shown by the gauge when each scene is on screen.
export const stops = [
    { id: "top", label: "Summit", elevation: 14411 },
    { id: "now", label: "Now", elevation: 9800 },
    { id: "experience", label: "Experience", elevation: 6200 },
    { id: "projects", label: "Projects", elevation: 2400 },
    { id: "records", label: "Stats", elevation: 400 },
    { id: "skills", label: "Skills", elevation: 0 },
    { id: "education", label: "Education", elevation: -60 },
    { id: "contact", label: "Contact", elevation: -130 },
];

// Add screenshots to `photos` as you take them. They replace the drawn art on the card.
export const nowProjects = [
    {
        title: "BeavBus",
        repo: "OSU-App-Club/beavbus",
        summary: "A university-requested app that modernizes campus transit tracking, with OSU shuttles and Corvallis city buses together on one live map.",
        points: [
            "Directing a team of 10+ students in the App Development Club",
            "Shows buses, routes, and stops for both transit systems",
            "Added city buses and stops that resize with zoom, and upgraded the app to Expo SDK 58",
        ],
        tech: ["React Native", "Expo", "TypeScript", "Redux", "React Native Maps", ".NET"],
        art: "bus",
        photos: ["/demos/BB1.png", "/demos/BB2.png", "/demos/BB3.png"],
    },
    {
        title: "Cube Solver",
        repo: "SeanG-rsd/rubiks-solver",
        summary: "A mobile app that scans a Rubik's Cube with your camera and walks you through solving it, move by move, on an interactive 3D model.",
        points: [
            "Samples tile colors from the live camera feed in real time",
            "Computes the solution with the Kociemba two-phase algorithm",
            "Integrating rubiks-algorithm, my own solver written in C++",
        ],
        tech: ["React Native", "Expo", "React Three Fiber", "FastAPI", "C++"],
        art: "cube",
        photos: [] as string[],
    },
    {
        title: "The Grand Tour",
        repo: "SeanG-rsd/TheGrandTour",
        summary: "A 2D game in Unity, played on a hex tilemap. Place buildings, grow your hives, and send your bees out across the map.",
        points: [
            "Tilemap with building placement and hover previews",
            "Bees travel between hives in lines, with erratic flight",
            "Started on a 3D grid before settling on a 2D tilemap",
        ],
        tech: ["Unity", "C#", "HLSL"],
        art: "hive",
        photos: [] as string[],
    },
];

export const experience = [
    {
        role: "Software Development Intern",
        org: "Wizards of the Coast",
        place: "Renton, WA",
        dates: "Jun 2026 to Aug 2026",
        points: [
            "Developed 20 in-game achievements for MTG Arena while working in a Kanban/Scrum environment.",
            "Used C# and NUnit for test-driven development, simulating games of Magic to test achievements and cards.",
            "Analyzed abstract syntax trees and CLIPS output, adjusting a Python NLTK parser to correctly output rules for new cards in upcoming sets.",
            "Resolved bugs in the C# replay transcoder by analyzing Protobuf messaging between the client and game rules engine, improving automated test generation from replays.",
        ],
    },
    {
        role: "Co-Founder",
        org: "Nutron Labs LLC",
        place: "Duvall, WA",
        dates: "Apr 2023 to Present",
        points: [
            "Designed, developed, and published 5 Unity mobile apps on the iOS App Store and Google Play, managing the product life cycle to reach 1,000+ total downloads.",
            "Shipped 2D puzzle, endless runner, and 3D multiplayer titles, building the core gameplay loops, responsive UI, and release builds for both stores.",
            "Built real-time multiplayer with Photon and backend services with PlayFab, and used Unity Analytics events to improve retention and session metrics.",
        ],
    },
    {
        role: "Undergraduate Research Assistant",
        org: "Oregon State University, STAR Lab",
        place: "Corvallis, OR",
        dates: "Oct 2024 to Jan 2026",
        points: [
            "Built Meala, a Flutter mobile app that uses an LLM to generate personalized nutrition guidance aligned to user goals.",
            "Implemented a Python RAG pipeline to ground recipe outputs in curated documents, improving recipe validity from 68% to 90% across 300 test queries.",
            "Overhauled recipe browsing in Flutter, reducing taps to view a recipe from 6 to 2 and consolidating recipe details into a single dashboard.",
        ],
    },
];

export const projects = [
    {
        title: "SyllaBeavs",
        kind: "BeaverHacks 2025, 3rd place",
        dates: "Apr 2025",
        summary: "An AI syllabus parser with an interactive dashboard of course timelines and upcoming deadlines. Adds every assignment deadline to Google Calendar.",
        tech: ["FastAPI", "React", "OpenAI API", "Firebase", "Next.js", "TypeScript", "fly.io"],
        image: "/demos/SYL3.png",
        github: "https://github.com/SeanG-rsd/syllabeavs",
        live: "https://devpost.com/software/syllabeavs",
        liveLabel: "Devpost",
    },
    {
        title: "Chess Bot",
        kind: "1600 Chess.com ELO engine",
        dates: "Dec 2023 - Apr 2024",
        summary: "A chess engine using minimax with alpha-beta pruning, piece bitmaps, a board hash table to look up previous states, and common openings encoded in a decision tree.",
        tech: ["Java", "Minimax", "Alpha-Beta Pruning"],
        image: "/demos/ChessBot.svg",
        github: "https://github.com/SeanG-rsd/APComputerScience/tree/main/Chess",
    },
    {
        title: "Tank Battles - Online",
        kind: "3D multiplayer shooter",
        dates: "Jun 2023 - Dec 2023",
        summary: "Third-person tank battles across several game modes, with friends lists and parties. Photon runs the multiplayer and PlayFab connects the players.",
        tech: ["Unity", "C#", "Photon", "PlayFab"],
        image: "/demos/BT1.png",
        github: "https://github.com/SeanG-rsd/BattleTanks",
        live: "https://apps.apple.com/us/app/tank-battles-online/id6467826765",
        liveLabel: "App Store",
    },
    {
        title: "Ball Sorting in Tubes",
        kind: "2D puzzle game",
        dates: "Feb 2023 - Present",
        summary: "Thousands of levels, with backgrounds and ball colors to unlock. My introduction to Unity Ads and to publishing a game.",
        tech: ["Unity", "C#", "iOS", "Android"],
        image: "/demos/BS1.png",
        github: "https://github.com/SeanG-rsd/BallSort",
        live: "https://apps.apple.com/us/app/ball-sorting-in-tubes/id6447139347",
        liveLabel: "App Store",
    },
    {
        title: "Everything Calendar",
        kind: "Daily life tracker",
        dates: "Apr 2024 - Present",
        summary: "One place for goals, tasks, and events. It started as a Unity app, and I'm now rebuilding it in TypeScript with workouts and health tracking.",
        tech: ["TypeScript", "Unity", "C#", "iOS"],
        image: "/demos/EC1.png",
        github: "https://github.com/SeanG-rsd/Everything-Calendar",
        live: "https://apps.apple.com/us/app/everythingcalendar/id6504160364",
        liveLabel: "App Store",
    },
    {
        title: "In Between Worlds",
        kind: "2D sidescroller",
        dates: "Jan 2024",
        summary: "Outrun a wall that never stops chasing you while protecting your crate. Built in about a week for a game jam, then extended for the App Store.",
        tech: ["Unity", "C#", "iOS"],
        image: "/demos/IBW2.png",
        github: "https://github.com/SeanG-rsd/InBetweenWorlds",
        live: "https://apps.apple.com/us/app/in-between-worlds/id6475752584",
        liveLabel: "App Store",
    },
    {
        title: "Chicken Daydreams",
        kind: "Infinite 2D runner",
        dates: "Aug 2024 - Oct 2024",
        summary: "A pixel art runner in the spirit of Temple Run, with small side quests in the coops. A side project for practicing pixel art.",
        tech: ["Unity", "C#", "iOS"],
        image: "/demos/CR1.png",
        github: "https://github.com/SeanG-rsd/ChickenRun",
        live: "https://apps.apple.com/us/app/chicken-daydreams/id6686399476",
        liveLabel: "App Store",
    },
    {
        title: "Discord Dash",
        kind: "Discord bot",
        dates: "Apr 2025",
        summary: "A text-based dungeon crawler that lives in Discord, built for a challenge from one of my clubs.",
        tech: ["Python", "Discord"],
        image: "/demos/DB1.png",
        github: "https://github.com/GDSC-OregonState/discord-dash",
    },
    {
        title: "InstApply",
        kind: "Hackathon web app",
        dates: "Nov 2024",
        summary: "A job and internship application site built by a team of four in under 72 hours. My first time building a website frontend.",
        tech: ["React", "Supabase"],
        image: "/demos/InstApply.png",
        github: "https://github.com/quick007/instapply",
        live: "https://devpost.com/software/instapply",
        liveLabel: "Devpost",
    },
    {
        title: "This Website",
        kind: "Portfolio",
        dates: "Mar 2024 - Present",
        summary: "Astro, GSAP, and a lot of hand-drawn SVG. Keep scrolling, there's an octopus at the bottom.",
        tech: ["Astro", "GSAP", "SVG"],
        image: "/demos/WebsiteDemo.png",
        github: "https://github.com/SeanG-rsd/seangutmann",
    },
];

export const skills = [
    { name: "Languages", items: ["C#", "Java", "C++", "C", "Python", "TypeScript", "JavaScript", "Dart", "Elm", "HTML", "CSS"] },
    { name: "Frameworks", items: ["Unity 2D & 3D", "Flutter", "React", "React Native", "Next.js", "Astro", "FastAPI", "NUnit"] },
    { name: "Tools", items: ["Git", "Firebase", "Xcode", "Android Studio", "Visual Studio", "PyCharm", "Photon", "PlayFab"] },
    { name: "Areas", items: ["Mobile App Publishing", "Multiplayer Games", "LLMs & RAG", "Test-Driven Development"] },
];

export const education = [
    {
        school: "Oregon State University",
        credential: "B.S. Computer Science, Systems. Minor in Mathematics",
        dates: "Sep 2024 to Jun 2028",
        highlight: "4.0 GPA, Undergraduate Research Fellow, Honor Roll every term",
        detail: "Coursework: Data Structures, Analysis of Algorithms, Software Engineering I, Intro to Systems Programming, Programming Language Fundamentals, Digital Logic Design, Web Development, Discrete Math",
        current: "Taking now: Operating Systems I, Intro to Databases, Software Engineering II, Senior Software Engineering Project",
    },
    {
        school: "Cedarcrest High School",
        credential: "High School Diploma",
        dates: "Sep 2020 to Jun 2024",
        highlight: "4.0 GPA, Valedictorian",
    },
];

export const leadership = [
    {
        role: "President, App Development Club",
        dates: "Sep 2024 to Present",
        points: [
            "Selected to direct BeavBus, a university-requested project to modernize campus transit tracking across city and school bus services.",
            "Increased club attendance by 50% through in-person and social media outreach.",
        ],
    },
    {
        role: "Google Lead, Google Developer Club",
        dates: "Sep 2024 to Present",
        points: [
            "Manage the chapter's connection with Google and keep it accountable for meetings.",
            "Organize a term-long hackathon for 30+ students, providing assistance and judging.",
        ],
    },
    {
        role: "Undergraduate Research Fellow",
        points: ["Presented at the Spring Poster Symposium for URSA Engage."],
    },
];
