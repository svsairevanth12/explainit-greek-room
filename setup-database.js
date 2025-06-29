require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file for:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🗄️ Setting up Adaptive Learning Database...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'DATABASE_SETUP.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('📝 Executing database setup...');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`⚠️ Statement ${i + 1}: ${error.message}`);
          } else {
            console.log(`✅ Statement ${i + 1}: Executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️ Statement ${i + 1}: ${err.message}`);
        }
      }
    }

    // Verify tables exist
    console.log('\n🔍 Verifying tables...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['learning_analytics', 'learning_preferences']);

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError.message);
    } else {
      const tableNames = tables.map(t => t.table_name);
      
      if (tableNames.includes('learning_analytics')) {
        console.log('✅ learning_analytics table created');
      } else {
        console.log('❌ learning_analytics table missing');
      }
      
      if (tableNames.includes('learning_preferences')) {
        console.log('✅ learning_preferences table created');
      } else {
        console.log('❌ learning_preferences table missing');
      }
    }

    // Test the adaptive learning APIs
    console.log('\n🧪 Testing adaptive learning APIs...');
    
    const testUrl = 'http://localhost:3000';
    const axios = require('axios');
    
    try {
      const response = await axios.get(`${testUrl}/api/adaptive-learning/recommendations`);
      if (response.status === 200) {
        console.log('✅ Adaptive learning APIs working');
      }
    } catch (error) {
      console.log('⚠️ API test failed - make sure your dev server is running');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Test the adaptive learning features in your app');
    console.log('3. Check the dashboard for personalized recommendations');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n💡 Alternative setup:');
    console.error('1. Open your Supabase dashboard');
    console.error('2. Go to SQL Editor');
    console.error('3. Copy and paste the content from DATABASE_SETUP.sql');
    console.error('4. Run the SQL script');
  }
}

// Run the setup
setupDatabase();
