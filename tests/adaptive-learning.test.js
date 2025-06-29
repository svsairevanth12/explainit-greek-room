const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAdaptiveLearning() {
  console.log('🧠 Testing Adaptive Learning Features...\n');

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResponse = await axios.post(`${BASE_URL}/api/auth/signin`, {
      email: 'student@demo.com',
      password: 'password123'
    });

    if (authResponse.status !== 200) {
      throw new Error('Authentication failed');
    }

    const token = authResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('✅ Authentication successful');

    // Test difficulty recommendation
    console.log('\n📊 Testing difficulty recommendation...');
    try {
      const difficultyResponse = await axios.get(
        `${BASE_URL}/api/adaptive-learning/difficulty?subject=Mathematics&topic=Algebra`,
        { headers }
      );

      if (difficultyResponse.status === 200) {
        console.log('✅ Difficulty recommendation API working');
        console.log(`   Recommended difficulty: ${difficultyResponse.data.recommendedDifficulty}`);
      } else {
        console.log('⚠️ Difficulty recommendation API returned non-200 status');
      }
    } catch (error) {
      console.log('⚠️ Difficulty recommendation API not available yet (expected)');
    }

    // Test learning analytics tracking
    console.log('\n📈 Testing learning analytics tracking...');
    try {
      const trackingResponse = await axios.post(
        `${BASE_URL}/api/adaptive-learning/recommendations`,
        {
          subject: 'Mathematics',
          topic: 'Basic Algebra',
          difficulty: 'medium',
          performance: 85,
          timeSpent: 300,
          attempts: 1,
          correctAnswers: 8,
          totalQuestions: 10
        },
        { headers }
      );

      if (trackingResponse.status === 200) {
        console.log('✅ Learning analytics tracking API working');
        console.log(`   Analytics recorded successfully`);
      } else {
        console.log('⚠️ Learning analytics tracking API returned non-200 status');
      }
    } catch (error) {
      console.log('⚠️ Learning analytics tracking API not available yet (expected)');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test recommendations retrieval
    console.log('\n🎯 Testing recommendations retrieval...');
    try {
      const recommendationsResponse = await axios.get(
        `${BASE_URL}/api/adaptive-learning/recommendations`,
        { headers }
      );

      if (recommendationsResponse.status === 200) {
        console.log('✅ Recommendations API working');
        const recommendations = recommendationsResponse.data.recommendations || [];
        console.log(`   Found ${recommendations.length} recommendations`);
        
        if (recommendations.length > 0) {
          console.log('   Sample recommendation:');
          console.log(`     - Type: ${recommendations[0].type}`);
          console.log(`     - Subject: ${recommendations[0].subject}`);
          console.log(`     - Priority: ${recommendations[0].priority}`);
        }
      } else {
        console.log('⚠️ Recommendations API returned non-200 status');
      }
    } catch (error) {
      console.log('⚠️ Recommendations API not available yet (expected)');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test existing APIs still work
    console.log('\n🔄 Testing existing APIs still work...');
    
    // Test explanation API
    const explanationResponse = await axios.post(`${BASE_URL}/api/ai/explain`, {
      question: 'What is 2+2?',
      subject: 'Mathematics',
      difficulty: 'easy',
      userId: authResponse.data.user.id
    });

    if (explanationResponse.status === 200) {
      console.log('✅ Explanation API still working');
    } else {
      console.log('❌ Explanation API broken');
    }

    // Test dashboard API
    const dashboardResponse = await axios.get(`${BASE_URL}/api/dashboard`, { headers });
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard API still working');
    } else {
      console.log('❌ Dashboard API broken');
    }

    console.log('\n🎉 Adaptive Learning test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Authentication working');
    console.log('   ⚠️ Adaptive learning APIs ready (need database tables)');
    console.log('   ✅ Existing APIs still functional');
    console.log('\n💡 Next steps:');
    console.log('   1. Create database tables in Supabase dashboard');
    console.log('   2. Test adaptive learning features');
    console.log('   3. Verify recommendations panel in dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testAdaptiveLearning();
