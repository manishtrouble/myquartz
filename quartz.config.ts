import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "nicheQuill",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "test.manish-m.com",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        // 💡 Neon Theme - Light Mode
        lightMode: {
          light: "#FFFFFF",           // White background
          lightgray: "#E8E8E8",       // Light gray borders
          gray: "#888888",            // Medium gray
          darkgray: "#1A1A1A",        // Near-black body text
          dark: "#000000",            // Pure black headlines
          secondary: "#5800FF",       // Electric purple (links)
          tertiary: "#E900FF",        // Neon magenta (hover)
          highlight: "rgba(88, 0, 255, 0.12)",
          textHighlight: "#FFC60066", // Neon yellow highlight
        },
        // 🌃 Neon Theme - Dark Mode (Cyberpunk)
        darkMode: {
          light: "#000000",           // Pure black background
          lightgray: "#1A1A1A",       // Near-black borders
          gray: "#444444",            // Dark gray
          darkgray: "#E8E8E8",        // Light gray body text
          dark: "#FFFFFF",            // Pure white headlines
          secondary: "#FF5FCF",       // Pink (links)
          tertiary: "#9929EA",        // Purple (hover)
          highlight: "rgba(255, 95, 207, 0.2)",
          textHighlight: "#FAEB9288", // Pale yellow highlight
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
