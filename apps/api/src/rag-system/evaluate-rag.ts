#!/usr/bin/env node

import { config } from "dotenv";
import path from "node:path";
import { ragSystem } from "./index.js";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  config({ path: path.resolve(process.cwd(), ".env.development") });
}

// Test cases for evaluation
const testCases = [
  {
    query: "frontend developer roles",
    expectedRoles: ["Frontend Developer Lead", "Senior Frontend Developer"],
    minResults: 3,
  },
  {
    query: "React experience",
    expectedTechnologies: ["React", "Next.js", "TypeScript"],
    minResults: 3,
  },
  {
    query: "TypeScript projects",
    expectedTechnologies: ["TypeScript", "React", "Node.js"],
    minResults: 3,
  },
  {
    query: "team leadership experience",
    expectedRoles: ["Frontend Developer Lead"],
    minResults: 2,
  },
  {
    query: "current role",
    expectedRoles: ["Aigent", "OX2"],
    minResults: 2,
  },
  {
    query: "Node.js backend development",
    expectedTechnologies: ["Node.js", "Express", "API"],
    minResults: 2,
  },
];

async function runRAGEvaluation() {
  console.log('🧪 Running RAG System Evaluation...\n');

  try {
    await ragSystem.initialize();

    const stats = await ragSystem.getStats();
    console.log(`📊 Testing with ${stats.documentCount} document chunks\n`);

    for (const testCase of testCases) {
      console.log(`🔍 Testing: "${testCase.query}"`);

      const results = await ragSystem.query(testCase.query, {
        topK: 5,
        minScore: 0.3,
      });

      console.log(`📊 Results: ${results.length} (expected min: ${testCase.minResults})`);

      // Check if we meet minimum results
      const meetsMinimum = results.length >= testCase.minResults;
      console.log(`${meetsMinimum ? '✅' : '❌'} Minimum results: ${meetsMinimum}`);

      // Show top 3 results
      results.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. [${result.score.toFixed(3)}] ${result.metadata.section || 'Unknown'}`);
        console.log(`     Original: ${result.metadata.originalScore?.toFixed(3) || 'N/A'}, Recency: ${result.metadata.recencyScore?.toFixed(3) || 'N/A'}`);
        console.log(`     Years: ${result.metadata.startYear || 'N/A'} - ${result.metadata.endYear || 'N/A'}`);
        console.log(`     ${result.text.substring(0, 80)}...`);
      });

      console.log(''); // Empty line for readability
    }

    console.log('✅ Evaluation complete!');
  } catch (error) {
    console.error('❌ Error during evaluation:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runRAGEvaluation();
} 