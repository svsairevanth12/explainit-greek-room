import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExplanationRequest {
  question: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade?: string;
}

export interface QuizGenerationRequest {
  topic: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  grade?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export class OpenAIService {
  // Helper function to clean JSON response from OpenAI
  private static cleanJsonResponse(content: string): string {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  // Generate detailed explanations for student questions
  static async generateExplanation(request: ExplanationRequest): Promise<string> {
    try {
      const prompt = `You are an expert tutor helping a ${request.grade || 'high school'} student with ${request.subject}.
      
Question: ${request.question}
Difficulty Level: ${request.difficulty}

Please provide a clear, step-by-step explanation that:
1. Breaks down the concept into simple parts
2. Uses examples relevant to the student's level
3. Explains the reasoning behind each step
4. Includes helpful tips or mnemonics if applicable
5. Ends with a brief summary

Make the explanation engaging and easy to understand for a ${request.grade || 'high school'} student.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert tutor who explains complex topics in simple, engaging ways. Always provide step-by-step explanations with examples."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate an explanation at this time.";
    } catch (error) {
      console.error('OpenAI explanation error:', error);
      throw new Error('Failed to generate explanation');
    }
  }

  // Generate interactive quizzes
  static async generateQuiz(request: QuizGenerationRequest): Promise<QuizQuestion[]> {
    try {
      const prompt = `Create ${request.questionCount} multiple-choice questions about ${request.topic} in ${request.subject} for a ${request.grade || 'high school'} student.

Difficulty Level: ${request.difficulty}

For each question, provide:
1. A clear, well-written question
2. Four multiple-choice options (A, B, C, D)
3. The correct answer (indicate which option)
4. A detailed explanation of why the answer is correct

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation here"
  }
]

Make sure questions are appropriate for the ${request.difficulty} difficulty level and ${request.grade || 'high school'} grade level.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educator who creates high-quality educational assessments. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      const cleanedContent = this.cleanJsonResponse(content);
      const questions = JSON.parse(cleanedContent);
      return questions;
    } catch (error) {
      console.error('OpenAI quiz generation error:', error);
      // Return fallback questions if API fails
      return this.getFallbackQuestions(request.subject, request.topic);
    }
  }

  // Generate study recommendations
  static async generateStudyPlan(subjects: string[], weakAreas: string[], goals: string[]): Promise<string> {
    try {
      const prompt = `Create a personalized study plan for a student with the following profile:

Subjects: ${subjects.join(', ')}
Weak Areas: ${weakAreas.join(', ')}
Goals: ${goals.join(', ')}

Please provide:
1. A weekly study schedule
2. Specific focus areas for improvement
3. Recommended study techniques
4. Milestones and progress tracking suggestions
5. Tips for staying motivated

Make the plan practical and achievable.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educational consultant who creates personalized study plans that help students achieve their academic goals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || "I'll help you create a personalized study plan. Please provide more details about your learning goals.";
    } catch (error) {
      console.error('OpenAI study plan error:', error);
      throw new Error('Failed to generate study plan');
    }
  }

  // Generate language learning content
  static async generateLanguageContent(language: string, level: string, topic: string): Promise<any> {
    try {
      const prompt = `Create language learning content for ${language} at ${level} level, focusing on ${topic}.

Please provide:
1. 5 key vocabulary words with translations
2. 3 example sentences using these words
3. A short dialogue (4-6 exchanges) between two people
4. Grammar tips related to the topic
5. Cultural notes or context

Format as JSON with this structure:
{
  "vocabulary": [{"word": "word", "translation": "translation", "pronunciation": "pronunciation guide"}],
  "sentences": ["sentence 1", "sentence 2", "sentence 3"],
  "dialogue": [{"speaker": "A", "text": "text"}, {"speaker": "B", "text": "text"}],
  "grammar": "grammar explanation",
  "cultural": "cultural notes"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert language teacher who creates engaging, culturally authentic learning materials."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      const cleanedContent = this.cleanJsonResponse(content);
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('OpenAI language content error:', error);
      throw new Error('Failed to generate language content');
    }
  }

  // Fallback questions if API fails
  private static getFallbackQuestions(subject: string, topic: string): QuizQuestion[] {
    return [
      {
        question: `What is a key concept in ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "This is a basic question about the topic. Please try again later for more detailed questions."
      }
    ];
  }
}

export default OpenAIService;
