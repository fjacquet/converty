// SEO Performance Calculator

export interface SEOMetrics {
  titleLength: number;
  descriptionLength: number;
  h1Count: number;
  imageCount: number;
  imagesWithAlt: number;
  wordCount: number;
  linkCount: number;
  externalLinks: number;
  internalLinks: number;
}

export interface SEOScore {
  overall: number;
  title: { score: number; feedback: string };
  description: { score: number; feedback: string };
  headings: { score: number; feedback: string };
  images: { score: number; feedback: string };
  content: { score: number; feedback: string };
  links: { score: number; feedback: string };
}

export interface SEORecommendation {
  priority: "high" | "medium" | "low";
  category: string;
  issue: string;
  recommendation: string;
}

export function analyzeSEO(metrics: SEOMetrics): SEOScore {
  const scores: SEOScore = {
    overall: 0,
    title: { score: 0, feedback: "" },
    description: { score: 0, feedback: "" },
    headings: { score: 0, feedback: "" },
    images: { score: 0, feedback: "" },
    content: { score: 0, feedback: "" },
    links: { score: 0, feedback: "" },
  };

  // Title analysis (optimal: 50-60 characters)
  if (metrics.titleLength === 0) {
    scores.title = { score: 0, feedback: "Missing title tag" };
  } else if (metrics.titleLength < 30) {
    scores.title = { score: 50, feedback: "Title too short (under 30 chars)" };
  } else if (metrics.titleLength > 60) {
    scores.title = { score: 70, feedback: "Title too long (over 60 chars)" };
  } else if (metrics.titleLength >= 50 && metrics.titleLength <= 60) {
    scores.title = { score: 100, feedback: "Optimal title length" };
  } else {
    scores.title = { score: 85, feedback: "Good title length" };
  }

  // Description analysis (optimal: 150-160 characters)
  if (metrics.descriptionLength === 0) {
    scores.description = { score: 0, feedback: "Missing meta description" };
  } else if (metrics.descriptionLength < 120) {
    scores.description = { score: 50, feedback: "Description too short" };
  } else if (metrics.descriptionLength > 160) {
    scores.description = { score: 70, feedback: "Description may be truncated" };
  } else if (metrics.descriptionLength >= 150 && metrics.descriptionLength <= 160) {
    scores.description = { score: 100, feedback: "Optimal description length" };
  } else {
    scores.description = { score: 85, feedback: "Good description length" };
  }

  // Headings analysis
  if (metrics.h1Count === 0) {
    scores.headings = { score: 0, feedback: "Missing H1 tag" };
  } else if (metrics.h1Count === 1) {
    scores.headings = { score: 100, feedback: "Single H1 tag (ideal)" };
  } else {
    scores.headings = { score: 60, feedback: `Multiple H1 tags (${metrics.h1Count})` };
  }

  // Images analysis
  if (metrics.imageCount === 0) {
    scores.images = { score: 50, feedback: "No images found" };
  } else {
    const altRatio = metrics.imagesWithAlt / metrics.imageCount;
    if (altRatio === 1) {
      scores.images = { score: 100, feedback: "All images have alt text" };
    } else if (altRatio >= 0.8) {
      scores.images = {
        score: 80,
        feedback: `${Math.round((1 - altRatio) * 100)}% missing alt text`,
      };
    } else {
      scores.images = {
        score: 40,
        feedback: `${Math.round((1 - altRatio) * 100)}% missing alt text`,
      };
    }
  }

  // Content analysis (optimal: 300+ words)
  if (metrics.wordCount < 100) {
    scores.content = { score: 30, feedback: "Thin content (under 100 words)" };
  } else if (metrics.wordCount < 300) {
    scores.content = { score: 60, feedback: "Content could be longer" };
  } else if (metrics.wordCount < 1000) {
    scores.content = { score: 85, feedback: "Good content length" };
  } else {
    scores.content = { score: 100, feedback: "Substantial content" };
  }

  // Links analysis
  if (metrics.linkCount === 0) {
    scores.links = { score: 40, feedback: "No links found" };
  } else {
    const internalRatio = metrics.internalLinks / metrics.linkCount;
    if (internalRatio >= 0.7) {
      scores.links = { score: 100, feedback: "Good internal linking" };
    } else if (internalRatio >= 0.5) {
      scores.links = { score: 80, feedback: "Balanced link distribution" };
    } else {
      scores.links = { score: 60, feedback: "Consider more internal links" };
    }
  }

  // Calculate overall score
  const weights = {
    title: 0.2,
    description: 0.15,
    headings: 0.15,
    images: 0.15,
    content: 0.2,
    links: 0.15,
  };

  scores.overall = Math.round(
    scores.title.score * weights.title +
      scores.description.score * weights.description +
      scores.headings.score * weights.headings +
      scores.images.score * weights.images +
      scores.content.score * weights.content +
      scores.links.score * weights.links
  );

  return scores;
}

export function generateRecommendations(metrics: SEOMetrics): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];

  if (metrics.titleLength === 0) {
    recommendations.push({
      priority: "high",
      category: "Title",
      issue: "Missing title tag",
      recommendation: "Add a unique, descriptive title tag (50-60 characters)",
    });
  } else if (metrics.titleLength < 30 || metrics.titleLength > 60) {
    recommendations.push({
      priority: "medium",
      category: "Title",
      issue: `Title length: ${metrics.titleLength} characters`,
      recommendation: "Aim for 50-60 characters for optimal display",
    });
  }

  if (metrics.descriptionLength === 0) {
    recommendations.push({
      priority: "high",
      category: "Description",
      issue: "Missing meta description",
      recommendation: "Add a compelling meta description (150-160 characters)",
    });
  } else if (metrics.descriptionLength < 120 || metrics.descriptionLength > 160) {
    recommendations.push({
      priority: "medium",
      category: "Description",
      issue: `Description length: ${metrics.descriptionLength} characters`,
      recommendation: "Aim for 150-160 characters for optimal display",
    });
  }

  if (metrics.h1Count === 0) {
    recommendations.push({
      priority: "high",
      category: "Headings",
      issue: "Missing H1 tag",
      recommendation: "Add a single H1 tag with your main keyword",
    });
  } else if (metrics.h1Count > 1) {
    recommendations.push({
      priority: "medium",
      category: "Headings",
      issue: `Multiple H1 tags (${metrics.h1Count})`,
      recommendation: "Use only one H1 tag per page",
    });
  }

  if (metrics.imageCount > 0 && metrics.imagesWithAlt < metrics.imageCount) {
    const missing = metrics.imageCount - metrics.imagesWithAlt;
    recommendations.push({
      priority: "medium",
      category: "Images",
      issue: `${missing} images missing alt text`,
      recommendation: "Add descriptive alt text to all images",
    });
  }

  if (metrics.wordCount < 300) {
    recommendations.push({
      priority: "medium",
      category: "Content",
      issue: `Thin content (${metrics.wordCount} words)`,
      recommendation: "Aim for at least 300 words of quality content",
    });
  }

  if (metrics.linkCount > 0 && metrics.internalLinks < metrics.linkCount * 0.5) {
    recommendations.push({
      priority: "low",
      category: "Links",
      issue: "Few internal links",
      recommendation: "Add more internal links to related content",
    });
  }

  return recommendations.sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority] - priority[b.priority];
  });
}

export const SEO_BEST_PRACTICES = {
  title: {
    minLength: 30,
    maxLength: 60,
    optimalLength: "50-60 characters",
  },
  description: {
    minLength: 120,
    maxLength: 160,
    optimalLength: "150-160 characters",
  },
  content: {
    minWords: 300,
    optimalWords: "1000+ words for in-depth content",
  },
  images: {
    requirement: "All images should have descriptive alt text",
  },
  headings: {
    requirement: "One H1 tag, proper H2-H6 hierarchy",
  },
};
