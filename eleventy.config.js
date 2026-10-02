export default function (eleventyConfig) {
  // Static files are copied to the site as-is
  [
    "css",
    "js",
    "img",
    "fonts",
    "*.pdf",
    "projects/cs-440-report",
    "projects/resources",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  // External links and PDFs open in a new tab
  eleventyConfig.amendLibrary("md", (md) => {
    const defaultRender =
      md.renderer.rules.link_open ||
      ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const href = tokens[idx].attrGet("href") || "";
      if (/^https?:\/\//.test(href) || href.endsWith(".pdf")) {
        tokens[idx].attrSet("target", "_blank");
      }
      return defaultRender(tokens, idx, options, env, self);
    };
  });

  // Splits a list into n roughly equal columns, keeping order
  eleventyConfig.addFilter("columns", (items, n) => {
    const size = Math.ceil(items.length / n);
    return Array.from({ length: n }, (_, i) => items.slice(i * size, (i + 1) * size));
  });

  // Every topic used across the given lists of entries, most common first
  eleventyConfig.addFilter("topicList", (...lists) => {
    const counts = new Map();
    lists.flat().forEach((entry) =>
      (entry.data.topics || []).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1))
    );
    return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
  };
}
