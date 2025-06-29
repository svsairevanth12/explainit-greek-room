const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDatabase() {
  console.log('🌱 Starting Supabase database seeding...\n');

  try {
    // Create demo users
    console.log('👤 Creating demo users...');
    
    const demoUsers = [
      {
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'password123',
        role: 'STUDENT',
        grade: 'high'
      },
      {
        name: 'Demo Parent',
        email: 'parent@demo.com',
        password: 'password123',
        role: 'PARENT',
        grade: null
      }
    ];

    const createdUsers = [];
    
    for (const userData of demoUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        console.log(`   ✅ User ${userData.email} already exists`);
        createdUsers.push(existingUser);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          password_hash: hashedPassword,
          role: userData.role,
          grade: userData.grade,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Error creating user ${userData.email}:`, error);
        continue;
      }

      console.log(`   ✅ Created user: ${userData.email}`);
      createdUsers.push(user);

      // Create user settings
      await supabase
        .from('user_settings')
        .insert([{
          user_id: user.id,
          notifications_enabled: true,
          voice_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }

    // Create demo exam sessions
    console.log('\n📚 Creating demo exam sessions...');
    
    const studentUser = createdUsers.find(u => u.email === 'student@demo.com');
    if (studentUser) {
      const examSessions = [
        {
          user_id: studentUser.id,
          subject: 'Mathematics',
          topic: 'Algebra',
          question: 'What is the solution to 2x + 5 = 15?',
          answer: 'x = 5',
          explanation: 'To solve 2x + 5 = 15, subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5.',
          difficulty: 'medium',
          is_correct: true,
          time_spent: 120
        },
        {
          user_id: studentUser.id,
          subject: 'Science',
          topic: 'Physics',
          question: 'What is the formula for kinetic energy?',
          answer: 'KE = 1/2 * m * v²',
          explanation: 'Kinetic energy is the energy of motion. The formula is KE = 1/2 * mass * velocity squared.',
          difficulty: 'medium',
          is_correct: true,
          time_spent: 90
        },
        {
          user_id: studentUser.id,
          subject: 'English',
          topic: 'Grammar',
          question: 'What is the difference between "affect" and "effect"?',
          answer: 'Affect is a verb, effect is a noun',
          explanation: 'Affect is typically used as a verb meaning to influence something. Effect is typically used as a noun meaning a result or consequence.',
          difficulty: 'easy',
          is_correct: true,
          time_spent: 60
        }
      ];

      for (const session of examSessions) {
        const { error } = await supabase
          .from('exam_sessions')
          .insert([{
            ...session,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          }]);

        if (error) {
          console.error('   ❌ Error creating exam session:', error);
        } else {
          console.log(`   ✅ Created exam session: ${session.subject} - ${session.topic}`);
        }
      }
    }

    // Create demo quizzes and attempts
    console.log('\n🎯 Creating demo quizzes...');
    
    const quizzes = [
      {
        title: 'Basic Algebra Quiz',
        subject: 'Mathematics',
        description: 'Test your understanding of basic algebraic concepts',
        difficulty: 'easy',
        time_limit: 10,
        questions: [
          {
            question: 'What is 2x + 3 when x = 4?',
            options: ['9', '11', '13', '15'],
            correct: 1,
            explanation: '2(4) + 3 = 8 + 3 = 11'
          },
          {
            question: 'Solve for x: x - 5 = 10',
            options: ['5', '10', '15', '20'],
            correct: 2,
            explanation: 'x - 5 = 10, so x = 10 + 5 = 15'
          }
        ]
      }
    ];

    for (const quizData of quizzes) {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .insert([{
          ...quizData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('   ❌ Error creating quiz:', error);
        continue;
      }

      console.log(`   ✅ Created quiz: ${quizData.title}`);

      // Create quiz attempt
      if (studentUser) {
        await supabase
          .from('quiz_attempts')
          .insert([{
            user_id: studentUser.id,
            quiz_id: quiz.id,
            answers: [1, 2], // Correct answers
            score: 100,
            time_spent: 300,
            created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
          }]);

        console.log(`   ✅ Created quiz attempt for: ${quizData.title}`);
      }
    }

    // Create demo language sessions
    console.log('\n🗣️ Creating demo language sessions...');
    
    if (studentUser) {
      const languageSessions = [
        {
          user_id: studentUser.id,
          language: 'Spanish',
          conversation_type: 'lesson',
          topic: 'Greetings',
          transcript: [
            { speaker: 'AI', text: 'Hola, ¿cómo estás?' },
            { speaker: 'Student', text: 'Muy bien, gracias' }
          ],
          feedback: {
            vocabulary: ['hola', 'cómo', 'estás', 'muy', 'bien', 'gracias'],
            grammar: 'Good use of basic greeting structure',
            cultural: 'In Spanish-speaking countries, it\'s common to ask how someone is doing as part of a greeting'
          },
          pronunciation_score: 85,
          grammar_score: 90,
          vocabulary_score: 95,
          duration: 180
        }
      ];

      for (const session of languageSessions) {
        const { error } = await supabase
          .from('language_sessions')
          .insert([{
            ...session,
            created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
          }]);

        if (error) {
          console.error('   ❌ Error creating language session:', error);
        } else {
          console.log(`   ✅ Created language session: ${session.language} - ${session.topic}`);
        }
      }
    }

    // Create demo progress records
    console.log('\n📈 Creating demo progress records...');
    
    if (studentUser) {
      const progressRecords = [
        {
          user_id: studentUser.id,
          subject: 'Mathematics',
          topic: 'Algebra',
          skill_type: 'problem_solving',
          score: 85,
          max_score: 100,
          progress: 85
        },
        {
          user_id: studentUser.id,
          subject: 'Science',
          topic: 'Physics',
          skill_type: 'conceptual_understanding',
          score: 78,
          max_score: 100,
          progress: 78
        },
        {
          user_id: studentUser.id,
          language: 'Spanish',
          skill_type: 'pronunciation',
          score: 85,
          max_score: 100,
          progress: 85
        }
      ];

      for (const record of progressRecords) {
        const { error } = await supabase
          .from('progress_records')
          .insert([{
            ...record,
            created_at: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
          }]);

        if (error) {
          console.error('   ❌ Error creating progress record:', error);
        } else {
          console.log(`   ✅ Created progress record: ${record.subject || record.language} - ${record.skill_type}`);
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo accounts created:');
    console.log('   👨‍🎓 Student: student@demo.com / password123');
    console.log('   👨‍👩‍👧‍👦 Parent: parent@demo.com / password123');
    console.log('\n🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
