import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        limit: 3,
        showTags: false,
        linkToMore: "tags/evergreen" as SimpleSlug,
        filter: (f) => f.frontmatter?.tags?.includes("evergreen") ?? false,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Notes",
        limit: 3,
        showTags: false,
        linkToMore: "tags/seedling" as SimpleSlug,
        filter: (f) => {
          const tags = f.frontmatter?.tags ?? []
          return tags.includes("seedling") || tags.includes("budding")
        },
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    // Mobile-only: Recent Writing and Notes
    Component.MobileOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        limit: 3,
        showTags: false,
        linkToMore: "tags/evergreen" as SimpleSlug,
        filter: (f) => f.frontmatter?.tags?.includes("evergreen") ?? false,
      }),
    ),
    Component.MobileOnly(
      Component.RecentNotes({
        title: "Recent Notes",
        limit: 3,
        showTags: false,
        linkToMore: "tags/seedling" as SimpleSlug,
        filter: (f) => {
          const tags = f.frontmatter?.tags ?? []
          return tags.includes("seedling") || tags.includes("budding")
        },
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    // Life in Weeks - only on /life/ folder page
    Component.ConditionalRender({
      component: Component.LifeInWeeks({
        birthDate: "1995-01-01", // TODO: Update with your actual birthdate
        lifeExpectancy: 80,
        title: "Life in Weeks",
      }),
      condition: (page) => page.fileData.slug?.startsWith("life") ?? false,
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
