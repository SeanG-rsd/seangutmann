import { handles, nowProjects } from "./site";

// Stats are fetched when the site builds, so they're only as fresh as the last deploy.
// Every fetch fails soft: a null result means the widget is hidden, never made up.

const GITHUB_HEADERS: Record<string, string> = import.meta.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}` }
    : {};

async function getJson(url: string, init: RequestInit = {}) {
    try {
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
        if (response.ok) return await response.json();
        console.warn(`[stats] ${url} responded ${response.status}, so its widget will be hidden.`);
    } catch (error) {
        console.warn(`[stats] ${url} failed, so its widget will be hidden: ${error}`);
    }
    return null;
}

export interface Contribution { date: string; count: number; level: number; }

async function fetchGitHub(username: string) {
    const [profile, repos, contributions] = await Promise.all([
        getJson(`https://api.github.com/users/${username}`, { headers: GITHUB_HEADERS }),
        getJson(`https://api.github.com/users/${username}/repos?per_page=100`, { headers: GITHUB_HEADERS }),
        getJson(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
    ]);
    if (!profile) return null;

    const languageCounts = new Map<string, number>();
    for (const repo of repos ?? []) {
        if (!repo.fork && repo.language) {
            languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
        }
    }

    return {
        name: profile.name as string,
        login: profile.login as string,
        avatar: profile.avatar_url as string,
        url: profile.html_url as string,
        repos: profile.public_repos as number,
        followers: profile.followers as number,
        since: new Date(profile.created_at).getFullYear(),
        total: (contributions?.total?.lastYear ?? null) as number | null,
        days: (contributions?.contributions ?? []) as Contribution[],
        languages: [...languageCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, value: count, label: `${count} ${count === 1 ? "repo" : "repos"}` })),
    };
}

async function fetchCommits(repo: string) {
    // Filtered by author because some of these repos are shared with a team.
    const commits = await getJson(
        `https://api.github.com/repos/${repo}/commits?per_page=6&author=${handles.github}`,
        { headers: GITHUB_HEADERS },
    );
    if (!commits) return [];
    return commits
        .map((commit: any) => ({
            message: commit.commit.message.split("\n")[0] as string,
            date: commit.commit.author.date as string,
            url: commit.html_url as string,
        }))
        .filter((commit: { message: string }) => !commit.message.startsWith("Merge"))
        .slice(0, 3);
}

const LEETCODE_QUERY = `query($username: String!) {
    matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } }
    userContestRanking(username: $username) { attendedContestsCount rating globalRanking topPercentage }
    userContestRankingHistory(username: $username) { attended rating ranking contest { title startTime } }
}`;

export interface LeetCodeStats {
    url: string;
    sample: boolean;
    solved: { Easy: number; Medium: number; Hard: number };
    contest: { rating: number; attended: number; topPercent: number } | null;
    history: { title: string; date: string; rating: number; rank: number }[];
}

async function fetchLeetCode(username: string): Promise<LeetCodeStats | null> {
    const result = await getJson("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
        body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
    });
    const data = result?.data;
    if (!data?.matchedUser) return null;

    const solved = { Easy: 0, Medium: 0, Hard: 0 };
    for (const { difficulty, count } of data.matchedUser.submitStatsGlobal.acSubmissionNum) {
        if (difficulty in solved) solved[difficulty as keyof typeof solved] = count;
    }

    const ranking = data.userContestRanking;
    return {
        url: `https://leetcode.com/u/${username}/`,
        sample: false,
        solved,
        contest: ranking
            ? { rating: Math.round(ranking.rating), attended: ranking.attendedContestsCount, topPercent: ranking.topPercentage }
            : null,
        history: (data.userContestRankingHistory ?? [])
            .filter((entry: any) => entry.attended)
            .map((entry: any) => ({
                title: entry.contest.title,
                date: new Date(entry.contest.startTime * 1000).toISOString(),
                rating: Math.round(entry.rating),
                rank: entry.ranking,
            })),
    };
}

export interface WakaTimeStats {
    url: string;
    sample: boolean;
    range: string;
    total: string;
    dailyAverage: string;
    languages: { name: string; value: number; label: string }[];
    editor: string | null;
}

async function fetchWakaTime(username: string): Promise<WakaTimeStats | null> {
    // This range has to match the public stats range in your WakaTime profile settings.
    // API keys are rejected here, so the profile has to share its stats publicly.
    const result = await getJson(`https://wakatime.com/api/v1/users/${username}/stats/all_time`);
    const data = result?.data;
    if (!data?.human_readable_total) return null;
    return {
        url: `https://wakatime.com/@${username}`,
        sample: false,
        range: data.human_readable_range,
        total: data.human_readable_total,
        dailyAverage: data.human_readable_daily_average,
        languages: (data.languages ?? [])
            .slice(0, 5)
            .map((language: any) => ({ name: language.name, value: language.percent, label: language.text })),
        editor: data.editors?.[0]?.name ?? null,
    };
}

// Only ever used by `astro dev`, and always rendered with a "sample data" label.
const SAMPLE_LEETCODE: LeetCodeStats = {
    url: "https://leetcode.com",
    sample: true,
    solved: { Easy: 96, Medium: 74, Hard: 12 },
    contest: { rating: 1612, attended: 9, topPercent: 28.4 },
    history: [1500, 1488, 1523, 1547, 1531, 1566, 1590, 1584, 1612].map((rating, index) => ({
        title: `Sample Contest ${index + 1}`,
        date: new Date(Date.UTC(2026, index, 12)).toISOString(),
        rating,
        rank: 9000 - index * 620,
    })),
};

const SAMPLE_WAKATIME: WakaTimeStats = {
    url: "https://wakatime.com",
    sample: true,
    range: "since Jan 2026",
    total: "18 hrs 42 mins",
    dailyAverage: "2 hrs 40 mins",
    languages: [
        { name: "TypeScript", value: 46, label: "8 hrs 36 mins" },
        { name: "C++", value: 24, label: "4 hrs 29 mins" },
        { name: "C#", value: 17, label: "3 hrs 10 mins" },
        { name: "Python", value: 9, label: "1 hr 41 mins" },
    ],
    editor: "VS Code",
};

// `astro dev` re-renders on every reload, which would burn through GitHub's limit of 60
// anonymous requests an hour. GITHUB_TOKEN raises that limit for builds on shared hosts.
const CACHE_MS = 10 * 60 * 1000;
let cached: { at: number; stats: ReturnType<typeof loadStats> } | null = null;

export function getStats() {
    if (!cached || Date.now() - cached.at > CACHE_MS) {
        cached = { at: Date.now(), stats: loadStats() };
    }
    return cached.stats;
}

async function loadStats() {
    const [github, leetcode, wakatime, commitLists] = await Promise.all([
        fetchGitHub(handles.github),
        handles.leetcode ? fetchLeetCode(handles.leetcode) : null,
        handles.wakatime ? fetchWakaTime(handles.wakatime) : null,
        Promise.all(nowProjects.map((project) => fetchCommits(project.repo))),
    ]);

    return {
        github,
        leetcode: leetcode ?? (!handles.leetcode && import.meta.env.DEV ? SAMPLE_LEETCODE : null),
        wakatime: wakatime ?? (!handles.wakatime && import.meta.env.DEV ? SAMPLE_WAKATIME : null),
        commits: Object.fromEntries(nowProjects.map((project, index) => [project.repo, commitLists[index]])),
    };
}
