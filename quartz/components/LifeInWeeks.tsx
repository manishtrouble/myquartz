import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/lifeInWeeks.inline"
import style from "./styles/lifeInWeeks.scss"

interface LifeInWeeksOptions {
    title?: string
    birthDate: string // Format: "YYYY-MM-DD"
    lifeExpectancy?: number // Years, default 80
}

const defaultOptions: Partial<LifeInWeeksOptions> = {
    title: "Life in Weeks",
    lifeExpectancy: 80,
}

// Helper to get week number of the year
function getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}

// Helper to get date range for a specific week
function getWeekDateRange(year: number, week: number): { start: Date; end: Date } {
    const startOfYear = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7 - startOfYear.getDay()
    const start = new Date(year, 0, 1 + daysOffset)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
}

interface WeekEntry {
    week: number
    year: number
    title: string
    description?: string
    slug: string
    url: string
}

export default ((userOpts: LifeInWeeksOptions) => {
    const opts = { ...defaultOptions, ...userOpts }

    const LifeInWeeks: QuartzComponent = ({
        displayClass,
        fileData,
        allFiles,
    }: QuartzComponentProps) => {
        const birthDate = new Date(opts.birthDate)
        const today = new Date()
        const lifeExpectancy = opts.lifeExpectancy!

        // Calculate current age in weeks
        const birthYear = birthDate.getFullYear()
        const currentYear = today.getFullYear()
        const currentWeek = getWeekNumber(today)

        // Find existing weekly entries with their metadata
        const weeklyEntries = new Map<string, WeekEntry>()
        const entriesList: WeekEntry[] = []

        allFiles.forEach((file) => {
            // Match patterns like "life/week-06-2026" or similar
            const match = file.slug?.match(/life\/week-(\d+)-(\d+)/)
            if (match) {
                const [, weekStr, yearStr] = match
                const week = parseInt(weekStr, 10)
                const year = parseInt(yearStr, 10)
                const entry: WeekEntry = {
                    week,
                    year,
                    title: file.frontmatter?.title ?? `Week ${week}, ${year}`,
                    description: file.frontmatter?.description as string | undefined,
                    slug: file.slug!,
                    url: resolveRelative(fileData.slug!, file.slug as FullSlug),
                }
                weeklyEntries.set(`${year}-${weekStr.padStart(2, "0")}`, entry)
                entriesList.push(entry)
            }
        })

        // Sort entries by date (newest first)
        entriesList.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            return b.week - a.week
        })

        // Calculate stats
        const weeksLived = Math.max(
            0,
            (currentYear - birthYear) * 52 + currentWeek - getWeekNumber(birthDate),
        )
        const totalWeeks = lifeExpectancy * 52
        const weeksRemaining = totalWeeks - weeksLived

        // Generate the grid
        const rows = []
        for (let yearOffset = 0; yearOffset < lifeExpectancy; yearOffset++) {
            const year = birthYear + yearOffset
            const cells = []

            // Year label
            cells.push(
                <div class="year-label" key={`label-${year}`}>
                    {yearOffset % 5 === 0 ? yearOffset : ""}
                </div>,
            )

            // 52 weeks
            for (let week = 1; week <= 52; week++) {
                const { start, end } = getWeekDateRange(year, week)
                const weekKey = `${year}-${week.toString().padStart(2, "0")}`
                const entry = weeklyEntries.get(weekKey)
                const hasEntry = !!entry

                // Determine cell state
                let cellClass = "week-cell"
                if (year < currentYear || (year === currentYear && week < currentWeek)) {
                    cellClass += " lived"
                } else if (year === currentYear && week === currentWeek) {
                    cellClass += " current"
                } else {
                    cellClass += " future"
                }

                if (hasEntry) {
                    cellClass += " has-entry"
                }

                cells.push(
                    <div
                        class={cellClass}
                        key={weekKey}
                        data-week={week}
                        data-year={year}
                        data-week-start={start.toISOString().split("T")[0]}
                        data-week-end={end.toISOString().split("T")[0]}
                        data-has-entry={hasEntry}
                        data-entry-url={hasEntry ? entry.url : undefined}
                        data-entry-title={hasEntry ? entry.title : undefined}
                        data-entry-description={hasEntry ? entry.description : undefined}
                    />,
                )
            }

            rows.push(
                <div class="life-row" key={`row-${year}`} style={{ display: "contents" }}>
                    {cells}
                </div>,
            )
        }

        // Prepare entries data for the navigator
        const entriesJson = JSON.stringify(
            entriesList.map((e) => ({
                week: e.week,
                year: e.year,
                title: e.title,
                description: e.description ?? "",
                url: e.url,
            })),
        )

        return (
            <div class={classNames(displayClass, "life-in-weeks")} data-entries={entriesJson}>
                <h3>{opts.title}</h3>
                <p class="life-subtitle">
                    My life visualized in weeks. Each box is one week of existence.
                </p>

                {/* Event Navigator */}
                {entriesList.length > 0 && (
                    <div class="event-navigator">
                        <div class="nav-arrows">
                            <button class="nav-arrow prev" aria-label="Previous entry">
                                ▲
                            </button>
                            <button class="nav-arrow next" aria-label="Next entry">
                                ▼
                            </button>
                        </div>
                        <div class="event-display">
                            <div class="event-title">
                                <span class="event-week">Week {entriesList[0].week}</span>:{" "}
                                <a href={entriesList[0].url} class="internal">
                                    {entriesList[0].title}
                                </a>
                            </div>
                            {entriesList[0].description && (
                                <div class="event-description">{entriesList[0].description}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* The Grid */}
                <div class="life-grid-container">
                    <div class="life-grid">{rows}</div>
                </div>

                {/* Stats */}
                <div class="life-stats">
                    <div class="stat">
                        <span class="dot lived" />
                        <span>{weeksLived.toLocaleString()} lived</span>
                    </div>
                    <div class="stat">
                        <span class="dot current" />
                        <span>This week</span>
                    </div>
                    <div class="stat">
                        <span class="dot future" />
                        <span>{weeksRemaining.toLocaleString()} remaining</span>
                    </div>
                </div>

                <div class="tooltip" />
            </div>
        )
    }

    LifeInWeeks.css = style
    LifeInWeeks.afterDOMLoaded = script

    return LifeInWeeks
}) satisfies QuartzComponentConstructor<LifeInWeeksOptions>
