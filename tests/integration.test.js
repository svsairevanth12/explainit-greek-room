/**
 * Integration Tests for Explain It Platform with Supabase
 *
 * These tests verify that the main features are working correctly
 * and that the Supabase database integration is functioning properly.
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword123',
  role: 'STUDENT',
  grade: 'high'
};

const testQuestion = {
  question: 'What is the derivative of x²?',
  subject: 'Mathematics',
  difficulty: 'medium'
};

/**
 * Test API endpoints
 */
async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test 1: Health check (homepage)
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log(`✅ Homepage: ${response.status === 200 ? 'PASS' : 'FAIL'} (${response.status})`);
  } catch (error) {
    console.log(`❌ Homepage: FAIL - ${error.message}`);
  }

  // Test 2: Dashboard API
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`);
    const data = await response.json();
    console.log(`✅ Dashboard API: ${data.success ? 'PASS' : 'FAIL'} (${response.status})`);
  } catch (error) {
    console.log(`❌ Dashboard API: FAIL - ${error.message}`);
  }

  // Test 3: OpenAI Explanation API
  try {
    const response = await fetch(`${BASE_URL}/api/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testQuestion)
    });
    const data = await response.json();
    console.log(`✅ OpenAI Explanation: ${data.explanation ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.explanation) {
      console.log(`   📝 Sample explanation: "${data.explanation.substring(0, 100)}..."`);
    }
  } catch (error) {
    console.log(`❌ OpenAI Explanation: FAIL - ${error.message}`);
  }

  // Test 4: Quiz Generation API
  try {
    const response = await fetch(`${BASE_URL}/api/ai/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Algebra',
        subject: 'Mathematics',
        difficulty: 'medium',
        questionCount: 2
      })
    });
    const data = await response.json();
    console.log(`✅ Quiz Generation: ${data.questions ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.questions) {
      console.log(`   🎯 Generated ${data.questions.length} questions`);
    }
  } catch (error) {
    console.log(`❌ Quiz Generation: FAIL - ${error.message}`);
  }

  // Test 5: Language Content API
  try {
    const response = await fetch(`${BASE_URL}/api/language/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'Spanish',
        level: 'beginner',
        topic: 'Greetings'
      })
    });
    const data = await response.json();
    console.log(`✅ Language Content: ${data.content ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.content && data.content.vocabulary) {
      console.log(`   🗣️ Generated ${data.content.vocabulary.length} vocabulary words`);
    }
  } catch (error) {
    console.log(`❌ Language Content: FAIL - ${error.message}`);
  }

  // Test 6: Supabase Database Connection
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`);
    const data = await response.json();
    console.log(`✅ Supabase Database: ${data.success ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.user) {
      console.log(`   🗄️ Retrieved user data: ${data.user.name}`);
      console.log(`   📊 Study time: ${data.user.totalStudyTime}h, Quizzes: ${data.user.completedQuizzes}`);
    }
  } catch (error) {
    console.log(`❌ Supabase Database: FAIL - ${error.message}`);
  }

  // Test 7: Subject Performance API (Real-time Data)
  try {
    const response = await fetch(`${BASE_URL}/api/subject-performance`);
    const data = await response.json();
    console.log(`✅ Subject Performance: ${data.success ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.performance && data.performance.length > 0) {
      console.log(`   📈 Found ${data.performance.length} subjects with real performance data`);
      data.performance.slice(0, 3).forEach(subject => {
        console.log(`   📚 ${subject.subject}: ${subject.performance}% (${subject.totalActivities} activities, ${subject.trend})`);
      });
    }
  } catch (error) {
    console.log(`❌ Subject Performance: FAIL - ${error.message}`);
  }

  console.log('\n');
}

/**
 * Test page accessibility
 */
async function testPageAccessibility() {
  console.log('🌐 Testing Page Accessibility...\n');

  const pages = [
    '/',
    '/about',
    '/pricing',
    '/contact',
    '/help',
    '/signin',
    '/signup',
    '/dashboard',
    '/exam-whisperer',
    '/language-buddy',
    '/parent-portal',
    '/settings'
  ];

  for (const page of pages) {
    try {
      const response = await fetch(`${BASE_URL}${page}`);
      const status = response.status;
      const result = status === 200 ? 'PASS' : (status === 404 ? 'NOT FOUND' : 'FAIL');
      const icon = status === 200 ? '✅' : (status === 404 ? '⚠️' : '❌');
      console.log(`${icon} ${page}: ${result} (${status})`);
    } catch (error) {
      console.log(`❌ ${page}: FAIL - ${error.message}`);
    }
  }

  console.log('\n');
}

/**
 * Test database operations
 */
async function testDatabaseOperations() {
  console.log('🗄️ Testing Database Operations...\n');

  // Test user creation (signup)
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUser,
        email: `test-${Date.now()}@example.com` // Unique email
      })
    });
    const data = await response.json();
    console.log(`✅ User Creation: ${response.status === 201 ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.user) {
      console.log(`   👤 Created user: ${data.user.name}`);
    }
  } catch (error) {
    console.log(`❌ User Creation: FAIL - ${error.message}`);
  }

  // Test user authentication (signin)
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@demo.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log(`✅ User Authentication: ${response.status === 200 ? 'PASS' : 'FAIL'} (${response.status})`);
    if (data.user) {
      console.log(`   🔐 Authenticated user: ${data.user.name}`);
    }
  } catch (error) {
    console.log(`❌ User Authentication: FAIL - ${error.message}`);
  }

  console.log('\n');
}

/**
 * Performance tests
 */
async function testPerformance() {
  console.log('⚡ Testing Performance...\n');

  // Test homepage load time
  const startTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/`);
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    console.log(`✅ Homepage Load Time: ${loadTime}ms ${loadTime < 1000 ? '(GOOD)' : '(SLOW)'}`);
  } catch (error) {
    console.log(`❌ Homepage Load Time: FAIL - ${error.message}`);
  }

  // Test API response time
  const apiStartTime = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`);
    const apiEndTime = Date.now();
    const apiLoadTime = apiEndTime - apiStartTime;
    console.log(`✅ API Response Time: ${apiLoadTime}ms ${apiLoadTime < 500 ? '(GOOD)' : '(SLOW)'}`);
  } catch (error) {
    console.log(`❌ API Response Time: FAIL - ${error.message}`);
  }

  console.log('\n');
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Explain It Integration Tests\n');
  console.log('=' .repeat(50));
  console.log('\n');

  await testAPIEndpoints();
  await testPageAccessibility();
  await testDatabaseOperations();
  await testPerformance();

  console.log('=' .repeat(50));
  console.log('✨ Integration tests completed!\n');
  console.log('📋 Summary:');
  console.log('   - API endpoints tested');
  console.log('   - Page accessibility verified');
  console.log('   - Database operations checked');
  console.log('   - Performance metrics measured');
  console.log('\n💡 To run these tests:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Run this test file: node tests/integration.test.js');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testAPIEndpoints,
  testPageAccessibility,
  testDatabaseOperations,
  testPerformance,
  runTests
};
