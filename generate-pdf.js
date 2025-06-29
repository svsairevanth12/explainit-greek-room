const fs = require('fs');
const path = require('path');

// Simple HTML template for PDF conversion
const createHTMLFromMarkdown = (markdownContent) => {
  // Convert markdown to basic HTML
  let html = markdownContent
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in proper HTML structure
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explain It - Complete Knowledge Base</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            font-size: 2.5em;
            margin-top: 30px;
        }
        h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            font-size: 2em;
            margin-top: 25px;
        }
        h3 {
            color: #1e3a8a;
            font-size: 1.5em;
            margin-top: 20px;
        }
        h4 {
            color: #1e293b;
            font-size: 1.2em;
            margin-top: 15px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 5px;
        }
        code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            overflow-x: auto;
            margin: 15px 0;
        }
        pre code {
            background: none;
            padding: 0;
        }
        .toc {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .toc h2 {
            margin-top: 0;
            color: #1e40af;
        }
        .toc ul {
            list-style-type: none;
            padding-left: 0;
        }
        .toc li {
            margin-bottom: 8px;
        }
        .toc a {
            color: #2563eb;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        .header-info {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header-info h1 {
            color: white;
            border: none;
            margin: 0;
            font-size: 3em;
        }
        .header-info p {
            font-size: 1.2em;
            margin: 10px 0 0 0;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            color: #6b7280;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            h1 { page-break-before: always; }
            h1:first-child { page-break-before: avoid; }
        }
    </style>
</head>
<body>
    <div class="header-info">
        <h1>📚 EXPLAIN IT</h1>
        <p>Complete Knowledge Base & Platform Documentation</p>
        <p>AI-Powered EdTech Platform for Personalized Learning</p>
    </div>
    
    <div class="toc">
        <h2>📋 Table of Contents</h2>
        <ul>
            <li><a href="#executive-summary">🎯 Executive Summary</a></li>
            <li><a href="#platform-overview">🏢 Platform Overview</a></li>
            <li><a href="#target-audience">🎓 Target Audience</a></li>
            <li><a href="#core-features">🚀 Core Features & Capabilities</a></li>
            <li><a href="#adaptive-learning">🧠 Adaptive Learning Technology</a></li>
            <li><a href="#technical-architecture">🏗️ Technical Architecture</a></li>
            <li><a href="#user-interface">📱 User Interface & Experience</a></li>
            <li><a href="#analytics-reporting">📈 Analytics & Reporting</a></li>
            <li><a href="#deployment">🔧 Deployment & Infrastructure</a></li>
            <li><a href="#competitive-advantages">🎯 Competitive Advantages</a></li>
            <li><a href="#success-metrics">📊 Success Metrics & KPIs</a></li>
            <li><a href="#future-roadmap">🔮 Future Roadmap</a></li>
            <li><a href="#implementation-guide">🛠️ Implementation Guide</a></li>
            <li><a href="#privacy-security">🔒 Privacy & Security</a></li>
            <li><a href="#pricing-business">💰 Pricing & Business Model</a></li>
            <li><a href="#content-library">📚 Content Library & Curriculum</a></li>
            <li><a href="#gamification">🎮 Gamification & Engagement</a></li>
            <li><a href="#accessibility">🌐 Accessibility & Inclusion</a></li>
            <li><a href="#customer-success">📞 Customer Success & Support</a></li>
        </ul>
    </div>
    
    <div class="content">
        <p>${html}</p>
    </div>
    
    <div class="footer">
        <p><strong>© 2025 Explain It - Revolutionizing Education Through AI-Powered Learning</strong></p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>For the latest updates, visit: <a href="https://explainit-greek-room.vercel.app">https://explainit-greek-room.vercel.app</a></p>
    </div>
</body>
</html>`;
};

// Generate HTML file
console.log('📚 Generating Explain It Knowledge Base PDF...\n');

try {
  const markdownPath = path.join(__dirname, 'EXPLAIN_IT_KNOWLEDGE_BASE.md');
  const htmlPath = path.join(__dirname, 'EXPLAIN_IT_KNOWLEDGE_BASE.html');
  
  if (!fs.existsSync(markdownPath)) {
    console.error('❌ Markdown file not found:', markdownPath);
    process.exit(1);
  }
  
  const markdownContent = fs.readFileSync(markdownPath, 'utf8');
  const htmlContent = createHTMLFromMarkdown(markdownContent);
  
  fs.writeFileSync(htmlPath, htmlContent);
  console.log('✅ HTML file generated:', htmlPath);
  
  console.log('\n📋 Knowledge Base Contents:');
  console.log('   📄 Executive Summary & Platform Overview');
  console.log('   🎓 Target Audience & User Personas');
  console.log('   🚀 Core Features & AI Capabilities');
  console.log('   🧠 Adaptive Learning Technology');
  console.log('   🏗️ Technical Architecture & Database');
  console.log('   📱 User Interface & Experience Design');
  console.log('   📈 Analytics & Reporting Systems');
  console.log('   🔧 Deployment & Infrastructure');
  console.log('   🎯 Competitive Analysis & Advantages');
  console.log('   📊 Success Metrics & KPIs');
  console.log('   🔮 Future Roadmap & Development');
  console.log('   🛠️ Implementation & Setup Guide');
  console.log('   🔒 Privacy, Security & Compliance');
  console.log('   💰 Pricing & Business Model');
  console.log('   📚 Content Library & Curriculum');
  console.log('   🎮 Gamification & Engagement');
  console.log('   🌐 Accessibility & Inclusion');
  console.log('   📞 Customer Success & Support');
  
  console.log('\n🎉 Knowledge Base Generated Successfully!');
  console.log('\n📝 To convert to PDF:');
  console.log('   1. Open the HTML file in your browser');
  console.log('   2. Press Ctrl+P (or Cmd+P on Mac)');
  console.log('   3. Select "Save as PDF"');
  console.log('   4. Choose your preferred settings');
  console.log('   5. Save as "Explain_It_Knowledge_Base.pdf"');
  
  console.log('\n📊 Document Statistics:');
  const wordCount = markdownContent.split(/\s+/).length;
  const pageCount = Math.ceil(wordCount / 250); // Approximate pages
  console.log(`   📝 Word Count: ~${wordCount.toLocaleString()} words`);
  console.log(`   📄 Estimated Pages: ~${pageCount} pages`);
  console.log(`   📁 File Size: ${(fs.statSync(htmlPath).size / 1024).toFixed(1)} KB`);
  
} catch (error) {
  console.error('❌ Error generating knowledge base:', error.message);
  process.exit(1);
}
