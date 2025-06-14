# RAG System Testing & Evaluation Framework

This directory contains comprehensive end-to-end tests for evaluating the accuracy and performance of the RAG (Retrieval-Augmented Generation) system.

## 🎯 Overview

The testing framework evaluates:
- **Query Relevance**: Do queries return relevant documents?
- **Ranking Quality**: Are results ranked correctly by importance/recency?
- **Semantic Accuracy**: Do results match the semantic intent of queries?
- **Score Distribution**: Are scores meaningful and well-distributed?
- **Edge Cases**: How does the system handle unusual queries?

## 🧪 Test Structure

### Test Categories

1. **Query Relevance Tests**
   - Validates that expected sections, roles, and technologies appear in results
   - Checks minimum result counts
   - Verifies top result quality

2. **Ranking Quality Tests**
   - Ensures current roles rank higher than past roles
   - Validates recency-based ordering
   - Balances semantic relevance with temporal relevance

3. **Score Distribution Tests**
   - Checks that scores are meaningful and well-distributed
   - Validates proper sorting by combined score

4. **Edge Cases**
   - Tests queries with no results
   - Handles very specific queries
   - Tests high-threshold scenarios

### Test Data Structure

```typescript
interface ExpectedResult {
  query: string;
  expectedSections: string[];        // Sections that should appear
  expectedRoles?: string[];          // Job roles that should appear
  expectedTechnologies?: string[];   // Technologies mentioned
  minResults: number;                // Minimum expected results
  maxResults?: number;               // Maximum results to check
  topResultShouldContain?: string[]; // Keywords in top result
  rankingRules?: {                   // Ranking validation rules
    higherRanked: string;
    lowerRanked: string;
    reason: string;
  }[];
}
```

## 🚀 Running Tests

### Jest Test Suite (Comprehensive)
```bash
# Run all RAG evaluation tests
pnpm test:rag

# Run with verbose output
pnpm test:rag --verbose

# Run specific test
pnpm test:rag --testNamePattern="frontend developer roles"
```

### Manual Evaluation Script
```bash
# Quick evaluation of key queries
pnpm rag-evaluate
```

### Individual Test Commands
```bash
# Process documents first
pnpm rag-process-docs

# Check system status
pnpm rag-stats

# Quick test
pnpm rag-test

# Clear and reprocess
pnpm rag-clear
```

## 📊 Test Cases

### Frontend Development Queries
- `"frontend developer roles"` - Should find Frontend Developer Lead, Senior Frontend Developer
- `"React experience"` - Should find React-related roles and skills
- `"TypeScript projects"` - Should find TypeScript usage across roles

### Leadership & Experience Queries
- `"team leadership experience"` - Should prioritize leadership roles
- `"current role"` - Should rank current positions highest
- `"startup experience"` - Should find Aigent founder role

### Technical Queries
- `"Node.js backend development"` - Should find backend-related experience
- `"React frontend development"` - Should balance semantic relevance with recency

## 🔍 Evaluation Metrics

### Relevance Metrics
- **Precision**: Are returned results relevant to the query?
- **Recall**: Are all relevant documents found?
- **Top-K Accuracy**: Is the most relevant result in the top K results?

### Ranking Metrics
- **Recency Bias**: Do more recent roles rank higher?
- **Semantic Relevance**: Do semantically relevant results rank higher?
- **Current Role Boost**: Do current roles get appropriate priority?

### Quality Metrics
- **Score Distribution**: Are scores meaningful and well-distributed?
- **Consistency**: Do similar queries return consistent results?
- **Edge Case Handling**: Does the system handle unusual queries gracefully?

## 📈 Expected Results

### Query: "frontend developer roles"
**Expected Top Results:**
1. Tre | Frontend Developer Lead (2022-2024) - Recent + Exact match
2. prePO | Principal Web3 Frontend Engineer (2021-2022) - Semantic match
3. Cabonline | Senior Frontend Developer (2018-2022) - Role match

**Ranking Logic:**
- Semantic relevance (0.4-0.5 base score)
- Recency boost (+0.18 for recent roles)
- Current role boost (+0.1 if applicable)
- Section priority boost (+0.15 for experience)

### Query: "React experience"
**Expected Behavior:**
- Should find roles mentioning React in technologies
- Current roles should rank higher even with lower semantic scores
- Should include both explicit React mentions and inferred usage

## 🛠️ Customizing Tests

### Adding New Test Cases
```typescript
const newTestCase: ExpectedResult = {
  query: "your query here",
  expectedSections: ["Professional Experience"],
  expectedRoles: ["Role Name"],
  expectedTechnologies: ["Tech1", "Tech2"],
  minResults: 2,
  topResultShouldContain: ["keyword1", "keyword2"],
  rankingRules: [{
    higherRanked: "Recent Role",
    lowerRanked: "Older Role",
    reason: "Recency should take precedence"
  }]
};
```

### Adjusting Thresholds
```typescript
// In test files, adjust these parameters:
const results = await ragSystem.query(query, {
  topK: 10,           // Number of results to retrieve
  minScore: 0.3,      // Minimum relevance threshold
});
```

## 🐛 Debugging Failed Tests

### Common Issues

1. **Low Semantic Scores**
   - Check if query terms match document content
   - Verify embedding model is working correctly
   - Consider adding synonyms or related terms

2. **Incorrect Ranking**
   - Review recency score calculation
   - Check if current role detection is working
   - Verify section priority scoring

3. **Missing Results**
   - Ensure documents are processed correctly
   - Check if minScore threshold is too high
   - Verify chunk content includes expected keywords

### Debug Commands
```bash
# Check document processing
pnpm rag-stats

# Test with lower threshold
# Modify minScore in test files to 0.1 for debugging

# Manual query testing
pnpm rag-evaluate
```

## 📝 Test Output Example

```
🧪 Running RAG System Evaluation...

📊 Testing with 23 document chunks

🔍 Testing: "frontend developer roles"
📊 Results: 5 (expected min: 3)
✅ Minimum results: true
  1. [0.774] Professional Experience
     Original: 0.444, Recency: 0.900
     Years: 2022 - 2024
     # Daniel Treviño Bergman ## Professional Experience ### Tre | Frontend Developer...

✅ Expected sections found: Professional Experience
✅ Expected roles found: Frontend Developer Lead, Senior Frontend Developer
✅ Expected technologies found: React, TypeScript, JavaScript
✅ Top result contains: Frontend, Developer
✅ Ranking rule: "Frontend Developer Lead" ranks higher than "Senior Frontend Developer" (More recent role should rank higher)
```

## 🎯 Success Criteria

A test passes when:
- ✅ Minimum number of results are returned
- ✅ Expected sections appear in results
- ✅ Expected roles/technologies are found
- ✅ Top result contains required keywords
- ✅ Ranking rules are satisfied
- ✅ Scores are within expected ranges

## 🔄 Continuous Improvement

### Regular Testing
- Run tests after any changes to ranking algorithm
- Test with new document additions
- Validate after embedding model updates

### Performance Monitoring
- Track query response times
- Monitor score distributions over time
- Analyze ranking quality trends

### Feedback Integration
- Use test results to tune ranking parameters
- Adjust thresholds based on real-world usage
- Add new test cases based on user queries 