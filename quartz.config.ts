import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import remarkBreaks from "remark-breaks"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Riley's Beehive",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "vi-VN",
    baseUrl: "riley-beehive.vercel.app",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
  header: "Playfair Display",
  body: "Source Serif 4",
  code: "IBM Plex Mono",
},
      colors: {
  lightMode: {
    light: "#f5f0e8",
    lightgray: "#e8e0d0",
    gray: "#b8a898",
    darkgray: "#5c4a3a",
    dark: "#3d2b1f",
    secondary: "#7a9e9f",
    tertiary: "#c17b6f",
    highlight: "rgba(122, 158, 159, 0.12)",
    textHighlight: "#f0d9b5",
  },
  darkMode: {
    light: "#1e1a16",
    lightgray: "#2e2820",
    gray: "#6b5d52",
    darkgray: "#c9b8a8",
    dark: "#f0e6d6",
    secondary: "#7a9e9f",
    tertiary: "#c17b6f",
    highlight: "rgba(122, 158, 159, 0.12)",
    textHighlight: "#b3722088",
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
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, remarkPlugins: [remarkBreaks] }),
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
