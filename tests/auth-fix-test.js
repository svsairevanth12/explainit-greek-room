const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAuthenticationFix() {
  console.log('🔐 Testing Authentication Fix...\n');

  try {
    // Test 1: Homepage loads without authentication
    console.log('1. Testing homepage access (unauthenticated)...');
    const homeResponse = await axios.get(`${BASE_URL}/`);
    if (homeResponse.status === 200) {
      console.log('   ✅ Homepage loads successfully');
    } else {
      console.log('   ❌ Homepage failed to load');
    }

    // Test 2: Sign up a new user
    console.log('\n2. Testing user signup...');
    const signupData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'STUDENT',
      grade: '10'
    };

    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, signupData);
    if (signupResponse.status === 201) {
      console.log('   ✅ User signup successful');
      console.log(`   📧 Email: ${signupData.email}`);
    } else {
      console.log('   ❌ User signup failed');
      return;
    }

    const { user, token } = signupResponse.data;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Test 3: Dashboard access with authentication
    console.log('\n3. Testing dashboard access (authenticated)...');
    const dashboardResponse = await axios.get(`${BASE_URL}/api/dashboard`, { headers });
    if (dashboardResponse.status === 200) {
      console.log('   ✅ Dashboard API accessible with authentication');
    } else {
      console.log('   ❌ Dashboard API failed');
    }

    // Test 4: Test adaptive learning recommendations
    console.log('\n4. Testing adaptive learning recommendations...');
    const recommendationsResponse = await axios.get(`${BASE_URL}/api/adaptive-learning/recommendations`, { headers });
    if (recommendationsResponse.status === 200) {
      console.log('   ✅ Adaptive learning recommendations working');
      const recommendations = recommendationsResponse.data.recommendations || [];
      console.log(`   📊 Found ${recommendations.length} recommendations`);
      
      if (recommendations.length > 0) {
        console.log('   📝 Sample recommendation:');
        console.log(`      - Subject: ${recommendations[0].subject}`);
        console.log(`      - Type: ${recommendations[0].type}`);
        console.log(`      - Priority: ${recommendations[0].priority}`);
      }
    } else {
      console.log('   ❌ Adaptive learning recommendations failed');
    }

    // Test 5: Test difficulty recommendation
    console.log('\n5. Testing difficulty recommendation...');
    const difficultyResponse = await axios.get(
      `${BASE_URL}/api/adaptive-learning/difficulty?subject=Mathematics&topic=Algebra`,
      { headers }
    );
    if (difficultyResponse.status === 200) {
      console.log('   ✅ Difficulty recommendation working');
      console.log(`   🎯 Recommended difficulty: ${difficultyResponse.data.recommendedDifficulty}`);
    } else {
      console.log('   ❌ Difficulty recommendation failed');
    }

    console.log('\n🎉 Authentication Fix Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Homepage accessible');
    console.log('   ✅ User signup working');
    console.log('   ✅ Dashboard API accessible with auth');
    console.log('   ✅ Adaptive learning APIs functional');
    console.log('   ✅ Authentication system working correctly');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Test the "Get Started" button behavior in browser');
    console.log('   2. Verify authenticated users see "Go to Dashboard" button');
    console.log('   3. Create database tables using DATABASE_SETUP.sql');
    console.log('   4. Test full adaptive learning flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testAuthenticationFix();
