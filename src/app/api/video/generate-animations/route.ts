/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { topic, script, duration, style } = await request.json();

    if (!topic || !script) {
      return NextResponse.json(
        { error: "Topic and script are required" },
        { status: 400 }
      );
    }

    // Create template-based animations instead of relying on OpenAI for HTML generation
    const htmlContent = createAnimationTemplate(topic, style, duration, script);

    // Enhance the generated HTML with additional animations
    const enhancedHtml = enhanceAnimations(htmlContent, topic, style, duration);

    return NextResponse.json({
      success: true,
      htmlContent: enhancedHtml,
      topic,
      duration,
      style,
    });

  } catch (error) {
    console.error("Animation generation error:", error);
    
    // Fallback to template-based animation
    const fallbackHtml = generateFallbackAnimation(topic, style, duration);
    
    return NextResponse.json({
      success: true,
      htmlContent: fallbackHtml,
      topic,
      duration,
      style,
      fallback: true,
    });
  }
}

function createAnimationTemplate(topic: string, style: string, duration: number, script: string): string {
  const styleColors = getStyleColors(style);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic} - Explainer Video</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            background: ${styleColors.background};
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .video-container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: ${styleColors.text};
            z-index: 10;
        }

        .title {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(50px);
            animation: slideInFade 2s ease-out forwards;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .content {
            font-size: 1.8rem;
            max-width: 85%;
            line-height: 1.8;
            opacity: 0;
            transform: translateY(30px);
            animation: slideInFade 2s ease-out 1s forwards;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }

        .floating-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            background: ${styleColors.accent};
            opacity: 0.6;
            animation: floatAround 8s ease-in-out infinite;
        }

        .shape:nth-child(1) { width: 80px; height: 80px; top: 10%; left: 10%; animation-delay: 0s; }
        .shape:nth-child(2) { width: 120px; height: 120px; top: 20%; right: 15%; animation-delay: 2s; }
        .shape:nth-child(3) { width: 60px; height: 60px; bottom: 20%; left: 20%; animation-delay: 4s; }
        .shape:nth-child(4) { width: 100px; height: 100px; bottom: 15%; right: 10%; animation-delay: 6s; }

        .interactive-element {
            position: absolute;
            width: 80px;
            height: 80px;
            background: ${styleColors.interactive};
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: pulse 3s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .interactive-element:hover {
            transform: scale(1.3);
            background: ${styleColors.interactiveHover};
        }

        .progress-bar {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: ${styleColors.accent};
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 3px;
        }

        @keyframes slideInFade {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatAround {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
            50% { transform: translateY(-10px) translateX(-20px) rotate(180deg); }
            75% { transform: translateY(-40px) translateX(10px) rotate(270deg); }
        }

        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 ${styleColors.interactive}; }
            50% { transform: scale(1.05); box-shadow: 0 0 0 10px transparent; }
            100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes scale {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .content-transition {
            transition: all 0.8s ease-in-out;
        }
    </style>
</head>
<body>
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>

    <div class="video-container">
        <h1 class="title">${topic}</h1>
        <div class="content content-transition" id="content">
            <p>Welcome to our exploration of ${topic}. Let's dive into this fascinating topic together!</p>
        </div>

        <div class="interactive-element" style="top: 15%; left: 15%;" onclick="createRipple(event)">💡</div>
        <div class="interactive-element" style="top: 25%; right: 20%;" onclick="createRipple(event)">🚀</div>
        <div class="interactive-element" style="bottom: 30%; left: 25%;" onclick="createRipple(event)">⭐</div>

        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
    </div>

    <script>
        let isPlaying = false;
        let animationStep = 0;
        let progressInterval;
        const totalDuration = ${duration};

        const contentSteps = [
            "Welcome to our exploration of ${topic}. Let's dive into this fascinating topic together!",
            "Understanding the fundamental concepts and core principles...",
            "Exploring practical applications and real-world examples...",
            "Discovering key insights and important details...",
            "Wrapping up with a comprehensive summary and next steps..."
        ];

        function createRipple(event) {
            const element = event.target;
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.8)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.8s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            ripple.style.pointerEvents = 'none';

            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 800);
        }

        function updateContent(text) {
            const content = document.getElementById('content');
            if (content) {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.innerHTML = '<p>' + text + '</p>';
                    content.style.opacity = '1';
                }, 300);
            }
        }

        function updateProgress(percentage) {
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = percentage + '%';
            }
        }

        function startAnimationSequence() {
            const stepDuration = totalDuration / contentSteps.length;
            let currentStep = 0;

            const stepInterval = setInterval(() => {
                if (currentStep < contentSteps.length && isPlaying) {
                    updateContent(contentSteps[currentStep]);

                    // Add visual effects
                    const elements = document.querySelectorAll('.interactive-element');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.animation = 'bounce 1s ease-in-out';
                        }, index * 200);
                    });

                    currentStep++;
                } else {
                    clearInterval(stepInterval);
                }
            }, stepDuration * 1000);

            // Progress bar animation
            let progress = 0;
            progressInterval = setInterval(() => {
                if (isPlaying && progress <= 100) {
                    updateProgress(progress);
                    progress += 100 / (totalDuration * 10); // Update every 100ms
                } else if (progress > 100) {
                    clearInterval(progressInterval);
                }
            }, 100);
        }

        // Message listener for external control
        window.addEventListener('message', function(event) {
            switch(event.data.action) {
                case 'play':
                    if (!isPlaying) {
                        isPlaying = true;
                        startAnimationSequence();
                    }
                    break;
                case 'pause':
                    isPlaying = false;
                    if (progressInterval) clearInterval(progressInterval);
                    break;
                case 'stop':
                    isPlaying = false;
                    animationStep = 0;
                    if (progressInterval) clearInterval(progressInterval);
                    updateProgress(0);
                    updateContent(contentSteps[0]);
                    break;
            }
        });

        // Add ripple effect CSS
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        \`;
        document.head.appendChild(style);

        // Auto-start when loaded
        window.addEventListener('load', function() {
            console.log('Animation ready for playback');
        });
    </script>
</body>
</html>`;
}

function getStyleColors(style: string) {
  const colorSchemes = {
    educational: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff',
      accent: 'rgba(255, 255, 255, 0.3)',
      interactive: 'rgba(255, 255, 255, 0.4)',
      interactiveHover: 'rgba(255, 255, 255, 0.6)'
    },
    modern: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff',
      accent: 'rgba(102, 126, 234, 0.6)',
      interactive: 'rgba(118, 75, 162, 0.8)',
      interactiveHover: 'rgba(118, 75, 162, 1)'
    },
    playful: {
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      text: '#333333',
      accent: 'rgba(255, 154, 158, 0.6)',
      interactive: 'rgba(254, 207, 239, 0.8)',
      interactiveHover: 'rgba(254, 207, 239, 1)'
    },
    professional: {
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      text: '#ecf0f1',
      accent: 'rgba(52, 152, 219, 0.6)',
      interactive: 'rgba(52, 152, 219, 0.8)',
      interactiveHover: 'rgba(52, 152, 219, 1)'
    }
  };

  return colorSchemes[style as keyof typeof colorSchemes] || colorSchemes.educational;
}

function enhanceAnimations(html: string, topic: string, style: string, duration: number): string {
  // Add meta tags and ensure proper structure
  const enhancedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic} - Explainer Video</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            overflow: hidden; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .video-container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }
        .title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeInUp 2s ease-out forwards;
        }
        .content {
            font-size: 1.5rem;
            max-width: 80%;
            line-height: 1.6;
            opacity: 0;
            animation: fadeInUp 2s ease-out 1s forwards;
        }
        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }
        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        .interactive-element {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        .interactive-element:hover {
            transform: scale(1.2);
            background: rgba(255, 255, 255, 0.4);
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    </style>
</head>
<body>
    <div class="video-container">
        <div class="particles" id="particles"></div>
        <h1 class="title">${topic}</h1>
        <div class="content" id="content">
            <p>Exploring the fascinating world of ${topic}...</p>
        </div>
        <div class="interactive-element" style="top: 20%; left: 10%;" onclick="createRipple(event)"></div>
        <div class="interactive-element" style="top: 60%; right: 15%;" onclick="createRipple(event)"></div>
    </div>

    <script>
        // Create floating particles
        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = Math.random() * 10 + 5 + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDelay = Math.random() * 6 + 's';
                container.appendChild(particle);
            }
        }

        // Create ripple effect
        function createRipple(event) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            event.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Animation timeline
        let animationStep = 0;
        const content = document.getElementById('content');
        
        function animateContent() {
            const steps = [
                "Understanding the fundamentals...",
                "Exploring key concepts...",
                "Real-world applications...",
                "Summary and insights..."
            ];
            
            if (animationStep < steps.length) {
                content.innerHTML = '<p>' + steps[animationStep] + '</p>';
                animationStep++;
                setTimeout(animateContent, ${duration * 1000 / 4});
            }
        }

        // Message listener for external control
        window.addEventListener('message', function(event) {
            if (event.data.action === 'play') {
                startAnimation();
            } else if (event.data.action === 'pause') {
                pauseAnimation();
            } else if (event.data.action === 'stop') {
                resetAnimation();
            }
        });

        function startAnimation() {
            createParticles();
            setTimeout(animateContent, 2000);
        }

        function pauseAnimation() {
            // Pause CSS animations
            document.body.style.animationPlayState = 'paused';
        }

        function resetAnimation() {
            animationStep = 0;
            content.innerHTML = '<p>Exploring the fascinating world of ${topic}...</p>';
            document.body.style.animationPlayState = 'running';
        }

        // Auto-start
        window.onload = function() {
            startAnimation();
        };

        // Add CSS animation for ripple effect
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;

  return enhancedHtml;
}

function generateFallbackAnimation(topic: string, style: string, duration: number): string {
  return enhanceAnimations("", topic, style, duration);
}
