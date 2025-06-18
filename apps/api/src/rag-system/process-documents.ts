#!/usr/bin/env node

/**
 * Document Processing Script
 *
 * This script initializes the RAG system and processes all documents
 * in the source-documents directory.
 *
 * Usage:
 *   npm run process-docs
 *   or
 *   bun run src/scripts/process-documents.ts
 */

import { config } from "dotenv";
import path from "node:path";
import { ragSystem } from "./index.js";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  config({ path: path.resolve(process.cwd(), ".env.development") });
}

async function main() {
  console.log("🚀 Starting RAG system document processing...");

  try {
    // Initialize the RAG system
    console.log("📝 Initializing RAG system...");
    await ragSystem.initialize();

    // Get initial stats
    const initialStats = await ragSystem.getStats();
    console.log(
      `📊 Current status: ${initialStats.documentCount} document chunks in index "${initialStats.indexName}"`,
    );

    // Process documents
    console.log("🔄 Processing documents...");
    await ragSystem.processDocuments();

    // Get final stats
    const finalStats = await ragSystem.getStats();
    console.log("✅ Processing complete!");
    console.log(
      `📈 Final status: ${finalStats.documentCount} document chunks in index "${finalStats.indexName}"`,
    );
    console.log(`🎯 Vector dimension: ${finalStats.dimension}`);

    // Test query
    console.log("\n🔍 Testing query functionality...");
    const testResults = await ragSystem.query("professional experience", {
      topK: 3,
    });

    if (testResults.length > 0) {
      console.log(
        `✅ Query test successful! Found ${testResults.length} relevant results.`,
      );
      console.log("📋 Sample results:");
      testResults.forEach((result, index) => {
        console.log(
          `  ${index + 1}. [Score: ${result.score.toFixed(3)}] ${result.text.substring(0, 100)}...`,
        );
        console.log(`     Source: ${result.metadata.source || "Unknown"}`);
      });
    } else {
      console.log(
        "⚠️ Query test returned no results. Make sure you have documents in the source-documents folder.",
      );
    }

    console.log("\n🎉 RAG system is ready!");
    console.log(
      "💡 The assistant agent can now use the knowledge_search tool to search through your documents.",
    );
  } catch (error) {
    console.error("❌ Error during document processing:", error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
RAG Document Processing Script

Usage:
  bun run src/scripts/process-documents.ts [options]

Options:
  --help, -h     Show this help message
  --clear        Clear existing documents before processing
  --stats        Show current document statistics only
  --test         Run a test query only

Examples:
  # Process all documents
  bun run src/scripts/process-documents.ts
  
  # Clear and reprocess all documents
  bun run src/scripts/process-documents.ts --clear
  
  # Check current statistics
  bun run src/scripts/process-documents.ts --stats
  
  # Test query functionality
  bun run src/scripts/process-documents.ts --test
  `);
  process.exit(0);
}

if (args.includes("--stats")) {
  ragSystem
    .getStats()
    .then((stats) => {
      console.log("📊 RAG System Statistics:");
      console.log(`   Index Name: ${stats.indexName}`);
      console.log(`   Document Count: ${stats.documentCount}`);
      console.log(`   Vector Dimension: ${stats.dimension}`);
      console.log(
        `   Status: ${stats.documentCount > 0 ? "Ready" : "No documents processed"}`,
      );
    })
    .catch((error) => {
      console.error("❌ Error getting stats:", error);
      process.exit(1);
    });
} else if (args.includes("--test")) {
  ragSystem
    .query("professional experience", { topK: 3 })
    .then((results) => {
      console.log("🔍 Test Query Results:");
      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(
            `  ${index + 1}. [Score: ${result.score.toFixed(3)}] ${result.text.substring(0, 100)}...`,
          );
          console.log(`     Source: ${result.metadata.source || "Unknown"}`);
        });
      } else {
        console.log("⚠️ No results found. Make sure documents are processed.");
      }
    })
    .catch((error) => {
      console.error("❌ Error testing query:", error);
      process.exit(1);
    });
} else if (args.includes("--clear")) {
  console.log("🗑️ Clearing existing documents...");
  ragSystem
    .clearDocuments()
    .then(() => {
      return main();
    })
    .catch((error) => {
      console.error("❌ Error clearing documents:", error);
      process.exit(1);
    });
} else {
  main();
}
