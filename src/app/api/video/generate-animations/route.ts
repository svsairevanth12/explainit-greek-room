/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, script, duration, style } = await request.json();

    if (!topic || !script) {
      return NextResponse.json(
        { error: "Topic and script are required" },
        { status: 400 }
      );
    }

    // Generate AI-powered visual explanations with real-time animations
    const htmlContent = await generateVisualExplanations(topic, style, duration, script);

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

async function generateVisualExplanations(topic: string, style: string, duration: number, script: string): Promise<string> {
  try {
    // Generate AI-powered visual elements based on the topic and script
    const visualPrompt = `Create detailed visual explanation elements for an educational video about "${topic}".

Script content: "${script}"

Generate a JSON structure with visual elements that should appear during the video:
1. Charts and graphs (bar charts, pie charts, line graphs)
2. Diagrams and flowcharts
3. Interactive elements
4. Data visualizations
5. Concept illustrations
6. Step-by-step visual breakdowns

For each visual element, specify:
- type: "chart", "diagram", "animation", "data", "concept"
- timing: when it should appear (0-${duration} seconds)
- data: actual data points or values to visualize
- description: what it explains
- animation: how it should animate in

Focus on making complex concepts visual and easy to understand. Include real data and examples where possible.

Return only valid JSON format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert data visualization and educational content creator. Generate detailed visual explanation structures in JSON format for educational videos."
        },
        {
          role: "user",
          content: visualPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const visualData = completion.choices[0]?.message?.content;
    let parsedVisuals;

    try {
      parsedVisuals = JSON.parse(visualData || '{}');
    } catch {
      parsedVisuals = generateDefaultVisuals(topic);
    }

    return createAdvancedAnimationTemplate(topic, style, duration, script, parsedVisuals);

  } catch (error) {
    console.error('Error generating visual explanations:', error);
    return createAdvancedAnimationTemplate(topic, style, duration, script, generateDefaultVisuals(topic));
  }
}

function generateDefaultVisuals(topic: string) {
  // Generate default visuals based on topic
  const topicVisuals: { [key: string]: any } = {
    'machine learning': {
      charts: [
        { type: 'line', data: [10, 25, 45, 70, 85, 95], labels: ['Data', 'Training', 'Testing', 'Validation', 'Optimization', 'Deployment'], title: 'ML Pipeline Progress' },
        { type: 'bar', data: [85, 92, 78, 88], labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'], title: 'Model Performance' }
      ],
      diagrams: [
        { type: 'neural_network', nodes: [3, 5, 3, 1], title: 'Neural Network Architecture' },
        { type: 'flowchart', steps: ['Input Data', 'Feature Engineering', 'Model Training', 'Evaluation', 'Deployment'], title: 'ML Workflow' }
      ]
    },
    'photosynthesis': {
      charts: [
        { type: 'pie', data: [30, 45, 25], labels: ['Light Reactions', 'Calvin Cycle', 'Energy Storage'], title: 'Photosynthesis Process' },
        { type: 'line', data: [0, 20, 60, 85, 95, 100], labels: ['Sunlight', 'Chlorophyll', 'Water', 'CO2', 'Glucose', 'Oxygen'], title: 'Energy Conversion' }
      ],
      diagrams: [
        { type: 'plant_cell', components: ['Chloroplast', 'Thylakoid', 'Stroma'], title: 'Plant Cell Structure' },
        { type: 'chemical_equation', formula: '6CO2 + 6H2O + light → C6H12O6 + 6O2', title: 'Photosynthesis Equation' }
      ]
    }
  };

  const topicKey = topic.toLowerCase();
  return topicVisuals[topicKey] || {
    charts: [
      { type: 'bar', data: [25, 50, 75, 100], labels: ['Concept 1', 'Concept 2', 'Concept 3', 'Mastery'], title: `${topic} Progress` }
    ],
    diagrams: [
      { type: 'concept_map', nodes: ['Introduction', 'Key Concepts', 'Applications', 'Summary'], title: `${topic} Overview` }
    ]
  };
}

function createAdvancedAnimationTemplate(topic: string, style: string, duration: number, script: string, visualData: any): string {
  const styleColors = getStyleColors(style);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic} - Visual Explainer</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            background: ${styleColors.background};
            height: 100vh;
            position: relative;
        }

        .video-container {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-areas:
                "title title"
                "content visuals"
                "progress progress";
            grid-template-rows: 15% 75% 10%;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
        }

        .title-section {
            grid-area: title;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: ${styleColors.text};
        }

        .title {
            font-size: 3rem;
            font-weight: bold;
            opacity: 0;
            transform: translateY(30px);
            animation: slideInFade 2s ease-out forwards;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .content-section {
            grid-area: content;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 20px;
            color: ${styleColors.text};
        }

        .visuals-section {
            grid-area: visuals;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .chart-container {
            width: 100%;
            height: 300px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.8s ease;
        }

        .chart-container.active {
            opacity: 1;
            transform: scale(1);
        }

        .diagram-container {
            width: 100%;
            height: 200px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.8s ease;
        }

        .diagram-container.active {
            opacity: 1;
            transform: translateX(0);
        }

        .content {
            font-size: 1.4rem;
            line-height: 1.6;
            opacity: 0;
            transform: translateY(30px);
            animation: slideInFade 2s ease-out 1s forwards;
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.5s ease;
        }

        .progress-section {
            grid-area: progress;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.3);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: ${styleColors.accent};
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 4px;
        }

        .data-point {
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            background: ${styleColors.interactive};
            border-radius: 20px;
            color: white;
            font-weight: bold;
            opacity: 0;
            transform: scale(0);
            animation: popIn 0.5s ease forwards;
        }

        .neural-network {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
        }

        .network-layer {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 80%;
        }

        .neuron {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: ${styleColors.interactive};
            margin: 5px;
            opacity: 0;
            animation: neuronPulse 2s ease-in-out infinite;
        }

        .connection {
            position: absolute;
            height: 2px;
            background: ${styleColors.accent};
            opacity: 0.6;
            animation: dataFlow 3s ease-in-out infinite;
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
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
            0% { opacity: 0; transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes neuronPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes dataFlow {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes chartGrow {
            from { height: 0; }
            to { height: var(--target-height); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
    <div class="video-container">
        <div class="title-section">
            <h1 class="title">${topic}</h1>
        </div>

        <div class="content-section">
            <div class="content" id="content">
                <p>Welcome to our visual exploration of ${topic}. Let's understand this concept through interactive visualizations!</p>
            </div>
        </div>

        <div class="visuals-section" id="visualsSection">
            <div class="chart-container" id="chartContainer">
                <canvas id="mainChart" width="400" height="250"></canvas>
            </div>
            <div class="diagram-container" id="diagramContainer">
                <div id="diagramContent"></div>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>
    </div>

    <script>
        let isPlaying = false;
        let animationStep = 0;
        let progressInterval;
        let currentChart = null;
        const totalDuration = ${duration};

        // Visual data from AI generation
        const visualData = ${JSON.stringify(visualData)};

        const contentSteps = [
            "Welcome to our visual exploration of ${topic}. Let's understand this concept through interactive visualizations!",
            "Let's start by examining the key data and relationships...",
            "Now we'll explore the underlying patterns and structures...",
            "Here we can see the practical applications and real-world impact...",
            "Finally, let's summarize what we've learned with a comprehensive overview..."
        ];

        // Chart creation functions
        function createBarChart(data, labels, title) {
            const ctx = document.getElementById('mainChart').getContext('2d');
            if (currentChart) currentChart.destroy();

            currentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: data,
                        backgroundColor: '${styleColors.interactive}',
                        borderColor: '${styleColors.accent}',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            color: 'white',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255,255,255,0.2)' }
                        },
                        x: {
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255,255,255,0.2)' }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        function createLineChart(data, labels, title) {
            const ctx = document.getElementById('mainChart').getContext('2d');
            if (currentChart) currentChart.destroy();

            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: data,
                        borderColor: '${styleColors.accent}',
                        backgroundColor: '${styleColors.interactive}',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            color: 'white',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255,255,255,0.2)' }
                        },
                        x: {
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255,255,255,0.2)' }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        function createPieChart(data, labels, title) {
            const ctx = document.getElementById('mainChart').getContext('2d');
            if (currentChart) currentChart.destroy();

            currentChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '${styleColors.interactive}',
                            '${styleColors.accent}',
                            'rgba(255,255,255,0.6)',
                            'rgba(255,255,255,0.4)'
                        ],
                        borderWidth: 2,
                        borderColor: 'white'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: title,
                            color: 'white',
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom',
                            labels: { color: 'white' }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        function createNeuralNetwork() {
            const container = document.getElementById('diagramContent');
            container.innerHTML = '';
            container.className = 'neural-network';

            const layers = [3, 5, 3, 1]; // Neural network structure

            layers.forEach((nodeCount, layerIndex) => {
                const layer = document.createElement('div');
                layer.className = 'network-layer';

                for (let i = 0; i < nodeCount; i++) {
                    const neuron = document.createElement('div');
                    neuron.className = 'neuron';
                    neuron.style.animationDelay = \`\${(layerIndex * 0.2) + (i * 0.1)}s\`;
                    layer.appendChild(neuron);
                }

                container.appendChild(layer);
            });
        }

        function createFlowchart(steps) {
            const container = document.getElementById('diagramContent');
            container.innerHTML = '';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.justifyContent = 'space-around';
            container.style.height = '100%';

            steps.forEach((step, index) => {
                const stepElement = document.createElement('div');
                stepElement.style.cssText = \`
                    padding: 10px 20px;
                    background: ${styleColors.interactive};
                    border-radius: 25px;
                    color: white;
                    text-align: center;
                    font-weight: bold;
                    margin: 5px 0;
                    opacity: 0;
                    transform: translateX(-50px);
                    animation: fadeInUp 0.8s ease forwards;
                    animation-delay: \${index * 0.3}s;
                \`;
                stepElement.textContent = step;
                container.appendChild(stepElement);

                if (index < steps.length - 1) {
                    const arrow = document.createElement('div');
                    arrow.style.cssText = \`
                        width: 0;
                        height: 0;
                        border-left: 10px solid transparent;
                        border-right: 10px solid transparent;
                        border-top: 15px solid ${styleColors.accent};
                        margin: 5px auto;
                        opacity: 0;
                        animation: fadeInUp 0.8s ease forwards;
                        animation-delay: \${(index + 0.5) * 0.3}s;
                    \`;
                    container.appendChild(arrow);
                }
            });
        }

        function createDataVisualization(dataPoints) {
            const container = document.getElementById('diagramContent');
            container.innerHTML = '';
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';

            dataPoints.forEach((point, index) => {
                const dataElement = document.createElement('div');
                dataElement.className = 'data-point';
                dataElement.style.animationDelay = \`\${index * 0.2}s\`;
                dataElement.textContent = point;
                container.appendChild(dataElement);
            });
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

            // Show initial chart
            showVisualForStep(0);

            const stepInterval = setInterval(() => {
                if (currentStep < contentSteps.length && isPlaying) {
                    updateContent(contentSteps[currentStep]);
                    showVisualForStep(currentStep);
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

        function showVisualForStep(step) {
            const chartContainer = document.getElementById('chartContainer');
            const diagramContainer = document.getElementById('diagramContainer');

            // Reset containers
            chartContainer.classList.remove('active');
            diagramContainer.classList.remove('active');

            setTimeout(() => {
                switch(step) {
                    case 0:
                        // Introduction - show overview chart
                        if (visualData.charts && visualData.charts[0]) {
                            const chart = visualData.charts[0];
                            if (chart.type === 'bar') {
                                createBarChart(chart.data, chart.labels, chart.title);
                            } else if (chart.type === 'line') {
                                createLineChart(chart.data, chart.labels, chart.title);
                            } else if (chart.type === 'pie') {
                                createPieChart(chart.data, chart.labels, chart.title);
                            }
                        } else {
                            // Default chart for topic
                            createBarChart([25, 50, 75, 100], ['Basics', 'Concepts', 'Applications', 'Mastery'], \`\${topic} Learning Progress\`);
                        }
                        chartContainer.classList.add('active');
                        break;

                    case 1:
                        // Key concepts - show diagram
                        if (visualData.diagrams && visualData.diagrams[0]) {
                            const diagram = visualData.diagrams[0];
                            if (diagram.type === 'neural_network') {
                                createNeuralNetwork();
                            } else if (diagram.type === 'flowchart') {
                                createFlowchart(diagram.steps || ['Step 1', 'Step 2', 'Step 3', 'Step 4']);
                            } else {
                                createDataVisualization(['Concept A', 'Concept B', 'Concept C', 'Integration']);
                            }
                        } else {
                            createFlowchart(['Introduction', 'Core Concepts', 'Applications', 'Summary']);
                        }
                        diagramContainer.classList.add('active');
                        break;

                    case 2:
                        // Patterns - show second chart if available
                        if (visualData.charts && visualData.charts[1]) {
                            const chart = visualData.charts[1];
                            if (chart.type === 'bar') {
                                createBarChart(chart.data, chart.labels, chart.title);
                            } else if (chart.type === 'line') {
                                createLineChart(chart.data, chart.labels, chart.title);
                            } else if (chart.type === 'pie') {
                                createPieChart(chart.data, chart.labels, chart.title);
                            }
                        } else {
                            createLineChart([10, 30, 60, 85, 95], ['Start', 'Learning', 'Practice', 'Apply', 'Master'], 'Progress Over Time');
                        }
                        chartContainer.classList.add('active');
                        break;

                    case 3:
                        // Applications - show data visualization
                        createDataVisualization(['Real-world Use', 'Industry Applications', 'Future Potential', 'Impact']);
                        diagramContainer.classList.add('active');
                        break;

                    case 4:
                        // Summary - show comprehensive chart
                        createPieChart([30, 25, 25, 20], ['Theory', 'Practice', 'Applications', 'Innovation'], \`\${topic} Knowledge Distribution\`);
                        chartContainer.classList.add('active');
                        break;
                }
            }, 300);
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
                    if (currentChart) currentChart.destroy();
                    document.getElementById('diagramContent').innerHTML = '';
                    document.getElementById('chartContainer').classList.remove('active');
                    document.getElementById('diagramContainer').classList.remove('active');
                    break;
            }
        });

        // Auto-start when loaded
        window.addEventListener('load', function() {
            console.log('Visual explainer ready for playback');
            // Initialize first visual
            setTimeout(() => {
                showVisualForStep(0);
            }, 1000);
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
