document.addEventListener("nav", () => {
    const containers = document.querySelectorAll(".life-in-weeks")

    containers.forEach((container) => {
        const cells = container.querySelectorAll(".week-cell")
        const tooltip = container.querySelector(".tooltip") as HTMLElement
        const prevBtn = container.querySelector(".nav-arrow.prev") as HTMLButtonElement
        const nextBtn = container.querySelector(".nav-arrow.next") as HTMLButtonElement
        const eventTitle = container.querySelector(".event-title") as HTMLElement
        const eventDescription = container.querySelector(".event-description") as HTMLElement
        const eventWeek = container.querySelector(".event-week") as HTMLElement

        // Get entries data
        const entriesStr = (container as HTMLElement).dataset.entries
        const entries: Array<{
            week: number
            year: number
            title: string
            description: string
            url: string
        }> = entriesStr ? JSON.parse(entriesStr) : []

        let currentEntryIndex = 0 // Start with first entry selected

        // Update the event display
        function updateEventDisplay() {
            if (entries.length === 0) return



            const entry = entries[currentEntryIndex]
            if (eventWeek) {
                eventWeek.textContent = `Week ${entry.week}`
            }
            if (eventTitle) {
                const link = eventTitle.querySelector("a")
                if (link) {
                    link.textContent = entry.title
                    link.href = entry.url
                }
            }
            if (eventDescription) {
                eventDescription.textContent = entry.description || ""
                eventDescription.style.display = entry.description ? "block" : "none"
            }

            // Highlight the corresponding cell in the grid
            cells.forEach((cell) => {
                cell.classList.remove("highlighted")
                const cellEl = cell as HTMLElement
                if (
                    parseInt(cellEl.dataset.week || "0") === entry.week &&
                    parseInt(cellEl.dataset.year || "0") === entry.year
                ) {
                    cell.classList.add("highlighted")
                    // Scroll the cell into view if needed
                    cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
                }
            })
        }

        // Arrow navigation
        if (prevBtn && entries.length > 0) {
            prevBtn.addEventListener("click", () => {
                currentEntryIndex = (currentEntryIndex - 1 + entries.length) % entries.length
                updateEventDisplay()
            })
        }

        if (nextBtn && entries.length > 0) {
            nextBtn.addEventListener("click", () => {
                currentEntryIndex = (currentEntryIndex + 1) % entries.length
                updateEventDisplay()
            })
        }

        // Tooltip handling
        if (!tooltip) return

        cells.forEach((cell) => {
            cell.addEventListener("mouseenter", (e) => {
                const target = e.target as HTMLElement
                const weekStart = target.dataset.weekStart
                const weekEnd = target.dataset.weekEnd
                const weekNum = target.dataset.week
                const year = target.dataset.year
                const hasEntry = target.dataset.hasEntry === "true"
                const entryTitle = target.dataset.entryTitle

                if (weekStart && weekEnd) {
                    let text = `Week ${weekNum}, ${year}\n${weekStart} – ${weekEnd}`
                    if (hasEntry && entryTitle) {
                        text += `\n📝 ${entryTitle}`
                    }
                    tooltip.textContent = text
                    tooltip.classList.add("visible")
                }
            })

            cell.addEventListener("mousemove", (e) => {
                const mouseEvent = e as MouseEvent
                tooltip.style.left = `${mouseEvent.clientX + 10}px`
                tooltip.style.top = `${mouseEvent.clientY + 10}px`
            })

            cell.addEventListener("mouseleave", () => {
                tooltip.classList.remove("visible")
            })

            cell.addEventListener("click", () => {
                const target = cell as HTMLElement
                const entryUrl = target.dataset.entryUrl
                if (entryUrl) {
                    window.location.href = entryUrl
                }
            })
        })

        // Initialize display
        if (entries.length > 0) {
            updateEventDisplay()
        }
    })
})
