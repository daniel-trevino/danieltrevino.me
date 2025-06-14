import { beforeAll, describe, expect, test } from "@jest/globals";
import { ragSystem } from "../index";

// Test data structure for evaluation
interface ExpectedResult {
  query: string;
  expectedSections: string[]; // Sections that should appear in results
  expectedRoles?: string[]; // Job roles that should appear
  expectedTechnologies?: string[]; // Technologies that should be mentioned
  minResults: number; // Minimum number of results expected
  maxResults?: number; // Maximum number of results to check
  topResultShouldContain?: string[]; // Keywords that should appear in top result
  rankingRules?: {
    // Role A should rank higher than Role B
    higherRanked: string;
    lowerRanked: string;
    reason: string;
  }[];
}

// Test cases for different query types
const testCases: ExpectedResult[] = [
  {
    query: "frontend developer roles",
    expectedSections: ["Professional Experience"],
    expectedRoles: [
      "Frontend Developer Lead",
      "Senior Frontend Developer",
      "Principal Web3 Frontend Engineer",
    ],
    expectedTechnologies: ["React", "TypeScript", "JavaScript"],
    minResults: 3,
    maxResults: 5,
    topResultShouldContain: ["Frontend", "Developer"],
    rankingRules: [
      {
        higherRanked: "Frontend Developer Lead",
        lowerRanked: "Senior Frontend Developer",
        reason: "More recent role should rank higher",
      },
    ],
  },
  {
    query: "React experience",
    expectedSections: ["Professional Experience", "Technical Skills"],
    expectedRoles: ["Frontend Developer", "Web3 Frontend Engineer"],
    expectedTechnologies: ["React", "Next.js", "TypeScript"],
    minResults: 3,
    topResultShouldContain: ["React"],
    rankingRules: [
      {
        higherRanked: "Aigent",
        lowerRanked: "Cabonline",
        reason: "Current role should rank higher than older role",
      },
    ],
  },
  {
    query: "TypeScript projects",
    expectedSections: ["Professional Experience"],
    expectedRoles: ["Frontend Developer", "Integration Developer"],
    expectedTechnologies: ["TypeScript", "React", "Node.js"],
    minResults: 3,
    topResultShouldContain: ["TypeScript"],
  },
  {
    query: "team leadership experience",
    expectedSections: ["Professional Experience"],
    expectedRoles: ["Frontend Developer Lead"],
    minResults: 2,
    topResultShouldContain: ["lead", "team", "developers"],
    rankingRules: [
      {
        higherRanked: "Frontend Developer Lead",
        lowerRanked: "Senior Frontend Developer",
        reason: "Leadership role should rank higher for leadership queries",
      },
    ],
  },
  {
    query: "current role",
    expectedSections: ["Professional Experience"],
    expectedRoles: ["Aigent", "OX2"],
    minResults: 2,
    topResultShouldContain: ["Present", "2025"],
    rankingRules: [
      {
        higherRanked: "Aigent",
        lowerRanked: "Tre",
        reason: "Current roles should rank higher than past roles",
      },
    ],
  },
  {
    query: "Node.js backend development",
    expectedSections: ["Professional Experience", "Technical Skills"],
    expectedTechnologies: ["Node.js", "Express", "API"],
    minResults: 2,
    topResultShouldContain: ["Node.js"],
  },
  {
    query: "startup experience",
    expectedSections: ["Professional Experience"],
    expectedRoles: ["Aigent"],
    minResults: 1,
    topResultShouldContain: ["Founder", "startup", "SaaS"],
  },
];

describe("RAG System End-to-End Evaluation", () => {
  beforeAll(async () => {
    // Initialize RAG system
    await ragSystem.initialize();

    // Ensure documents are processed
    const stats = await ragSystem.getStats();
    if (stats.documentCount === 0) {
      console.log("⚠️ No documents found, processing...");
      await ragSystem.processDocuments();
    }

    console.log(`📊 Testing with ${stats.documentCount} document chunks`);
  });

  describe("Query Relevance Tests", () => {
    testCases.forEach((testCase) => {
      test(`Query: "${testCase.query}"`, async () => {
        const results = await ragSystem.query(testCase.query, {
          topK: testCase.maxResults || 10,
          minScore: 0.3, // Lower threshold for testing
        });

        // Test 1: Minimum results check
        expect(results.length).toBeGreaterThanOrEqual(testCase.minResults);
        console.log(
          `✅ Found ${results.length} results (min: ${testCase.minResults})`,
        );

        // Test 2: Expected sections appear
        const foundSections = results
          .map((r) => r.metadata.section)
          .filter(Boolean);
        testCase.expectedSections.forEach((expectedSection) => {
          const sectionFound = foundSections.some((section) =>
            section.toLowerCase().includes(expectedSection.toLowerCase()),
          );
          expect(sectionFound).toBe(true);
        });
        console.log(
          `✅ Expected sections found: ${testCase.expectedSections.join(", ")}`,
        );

        // Test 3: Expected roles appear
        if (testCase.expectedRoles) {
          const resultTexts = results
            .map((r) => r.text.toLowerCase())
            .join(" ");
          testCase.expectedRoles.forEach((expectedRole) => {
            const roleFound = resultTexts.includes(expectedRole.toLowerCase());
            expect(roleFound).toBe(true);
          });
          console.log(
            `✅ Expected roles found: ${testCase.expectedRoles.join(", ")}`,
          );
        }

        // Test 4: Expected technologies (if specified)
        if (testCase.expectedTechnologies) {
          const resultTexts = results
            .map((r) => r.text.toLowerCase())
            .join(" ");
          testCase.expectedTechnologies.forEach((tech) => {
            const techFound = resultTexts.includes(tech.toLowerCase());
            expect(techFound).toBe(true);
          });
          console.log(
            `✅ Expected technologies found: ${testCase.expectedTechnologies.join(", ")}`,
          );
        }

        // Test 5: Top result quality
        if (testCase.topResultShouldContain && results.length > 0) {
          const topResult = results[0].text.toLowerCase();
          testCase.topResultShouldContain.forEach((keyword) => {
            const keywordFound = topResult.includes(keyword.toLowerCase());
            expect(keywordFound).toBe(true);
          });
          console.log(
            `✅ Top result contains: ${testCase.topResultShouldContain.join(", ")}`,
          );
        }

        // Test 6: Ranking rules
        if (testCase.rankingRules) {
          testCase.rankingRules.forEach((rule) => {
            const higherIndex = results.findIndex((r) =>
              r.text.toLowerCase().includes(rule.higherRanked.toLowerCase()),
            );
            const lowerIndex = results.findIndex((r) =>
              r.text.toLowerCase().includes(rule.lowerRanked.toLowerCase()),
            );

            if (higherIndex !== -1 && lowerIndex !== -1) {
              expect(higherIndex).toBeLessThan(lowerIndex);
              console.log(
                `✅ Ranking rule: "${rule.higherRanked}" ranks higher than "${rule.lowerRanked}" (${rule.reason})`,
              );
            }
          });
        }

        // Log results for manual inspection
        console.log("\n📋 Query Results:");
        results.slice(0, 3).forEach((result, index) => {
          console.log(
            `  ${index + 1}. [Score: ${result.score.toFixed(3)}] ${result.metadata.section || "Unknown"}`,
          );
          console.log(
            `     Years: ${result.metadata.startYear || "N/A"} - ${result.metadata.endYear || "N/A"}`,
          );
          console.log(`     Text: ${result.text.substring(0, 100)}...`);
        });
      });
    });
  });

  describe("Ranking Quality Tests", () => {
    test("Current roles should rank higher than past roles for general queries", async () => {
      const results = await ragSystem.query("professional experience", {
        topK: 10,
        minScore: 0.3,
      });

      expect(results.length).toBeGreaterThan(0);

      // Find current and past roles
      const currentRoles = results.filter(
        (r) => r.metadata.isCurrentRole === true,
      );
      const pastRoles = results.filter(
        (r) => r.metadata.isCurrentRole === false,
      );

      if (currentRoles.length > 0 && pastRoles.length > 0) {
        const topCurrentRoleIndex = results.findIndex(
          (r) => r.metadata.isCurrentRole === true,
        );
        const topPastRoleIndex = results.findIndex(
          (r) => r.metadata.isCurrentRole === false,
        );

        expect(topCurrentRoleIndex).toBeLessThan(topPastRoleIndex);
        console.log("✅ Current roles rank higher than past roles");
      }
    });

    test("More recent roles should rank higher than older roles", async () => {
      const results = await ragSystem.query("developer experience", {
        topK: 10,
        minScore: 0.3,
      });

      expect(results.length).toBeGreaterThanOrEqual(2);

      // Check that results are generally ordered by recency
      const rolesWithYears = results
        .filter((r) => r.metadata.startYear)
        .slice(0, 5); // Check top 5

      for (let i = 0; i < rolesWithYears.length - 1; i++) {
        const currentRole = rolesWithYears[i];
        const nextRole = rolesWithYears[i + 1];

        // Current role should have higher or equal recency score
        expect(currentRole.metadata.recencyScore).toBeGreaterThanOrEqual(
          nextRole.metadata.recencyScore - 0.1, // Small tolerance for ties
        );
      }
      console.log("✅ Results are ordered by recency");
    });

    test("Semantic relevance should be balanced with recency", async () => {
      const results = await ragSystem.query("React frontend development", {
        topK: 5,
        minScore: 0.3,
      });

      expect(results.length).toBeGreaterThan(0);

      // Top result should have reasonable semantic score
      const topResult = results[0];
      expect(topResult.metadata.originalScore).toBeGreaterThan(0.2);

      // Should contain React-related content
      const hasReactContent =
        topResult.text.toLowerCase().includes("react") ||
        topResult.text.toLowerCase().includes("frontend");
      expect(hasReactContent).toBe(true);

      console.log(
        `✅ Top result has semantic score: ${topResult.metadata.originalScore?.toFixed(3)}`,
      );
    });
  });

  describe("Score Distribution Tests", () => {
    test("Scores should be well distributed and meaningful", async () => {
      const results = await ragSystem.query("software development experience", {
        topK: 10,
        minScore: 0.1,
      });

      expect(results.length).toBeGreaterThan(0);

      // Check score distribution
      const scores = results.map((r) => r.score);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      expect(maxScore).toBeGreaterThan(minScore);
      expect(maxScore).toBeLessThanOrEqual(1.0);
      expect(minScore).toBeGreaterThan(0);

      console.log(
        `📊 Score distribution: Max: ${maxScore.toFixed(3)}, Min: ${minScore.toFixed(3)}, Avg: ${avgScore.toFixed(3)}`,
      );

      // Scores should be in descending order
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      }
      console.log("✅ Results are properly sorted by score");
    });
  });

  describe("Edge Cases", () => {
    test("Should handle queries with no results gracefully", async () => {
      const results = await ragSystem.query("quantum computing blockchain AI", {
        topK: 5,
        minScore: 0.8, // Very high threshold
      });

      // Should return empty array, not throw error
      expect(Array.isArray(results)).toBe(true);
      console.log(`✅ Handled high-threshold query: ${results.length} results`);
    });

    test("Should handle very specific queries", async () => {
      const results = await ragSystem.query(
        "Tre Frontend Developer Lead October 2022",
        {
          topK: 3,
          minScore: 0.3,
        },
      );

      expect(results.length).toBeGreaterThan(0);

      // Should find the specific role
      const treRole = results.find(
        (r) =>
          r.text.toLowerCase().includes("tre") &&
          r.text.toLowerCase().includes("frontend developer lead"),
      );
      expect(treRole).toBeDefined();
      console.log("✅ Found specific role with detailed query");
    });
  });
});
