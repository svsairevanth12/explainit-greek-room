/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, audioUrl, duration } = await request.json();

    if (!htmlContent || !audioUrl) {
      return NextResponse.json(
        { error: "HTML content and audio URL are required" },
        { status: 400 }
      );
    }

    // Sync audio with video animations
    const syncedHtml = syncAudioWithVideo(htmlContent, audioUrl, duration);

    return NextResponse.json({
      success: true,
      finalHtml: syncedHtml,
      duration,
    });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync content" },
      { status: 500 }
    );
  }
}

function syncAudioWithVideo(htmlContent: string, audioUrl: string, duration: number): string {
  // Inject audio element and sync controls into the HTML
  const audioElement = `
    <audio id="videoAudio" preload="auto" style="display: none;">
      <source src="${audioUrl}" type="audio/mpeg">
    </audio>
  `;

  // Enhanced sync script
  const syncScript = `
    <script>
      let isPlaying = false;
      let animationStartTime = 0;
      let animationTimeouts = [];
      const totalDuration = ${duration};

      // Audio element
      const audio = document.getElementById('videoAudio');

      // Prevent multiple audio instances
      audio.addEventListener('loadstart', function() {
        // Stop any other audio that might be playing
        document.querySelectorAll('audio').forEach(a => {
          if (a !== audio) {
            a.pause();
            a.currentTime = 0;
          }
        });
      });

      // Sync functions
      function startSync() {
        if (!isPlaying && audio) {
          isPlaying = true;
          animationStartTime = Date.now();

          // Clear any existing timeouts
          animationTimeouts.forEach(timeout => clearTimeout(timeout));
          animationTimeouts = [];

          audio.currentTime = 0;
          audio.play().catch(e => console.log('Audio play failed:', e));
          startAnimationSequence();
        }
      }

      function pauseSync() {
        if (isPlaying && audio) {
          isPlaying = false;
          audio.pause();
          pauseAnimations();

          // Clear animation timeouts
          animationTimeouts.forEach(timeout => clearTimeout(timeout));
          animationTimeouts = [];
        }
      }

      function stopSync() {
        isPlaying = false;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        resetAnimations();

        // Clear all timeouts
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
        animationTimeouts = [];
      }
      
      function startAnimationSequence() {
        // Timed animation sequence
        const intervals = [
          { time: 0, action: () => showTitle() },
          { time: totalDuration * 0.2, action: () => showContent1() },
          { time: totalDuration * 0.4, action: () => showContent2() },
          { time: totalDuration * 0.6, action: () => showContent3() },
          { time: totalDuration * 0.8, action: () => showConclusion() },
        ];

        intervals.forEach(interval => {
          const timeout = setTimeout(() => {
            if (isPlaying) interval.action();
          }, interval.time * 1000);
          animationTimeouts.push(timeout);
        });
      }
      
      function showTitle() {
        const title = document.querySelector('.title');
        if (title) {
          title.style.animation = 'fadeInUp 1s ease-out forwards';
        }
      }
      
      function showContent1() {
        updateContent("Understanding the core concepts...");
        addVisualEffect('pulse');
      }
      
      function showContent2() {
        updateContent("Exploring practical applications...");
        addVisualEffect('bounce');
      }
      
      function showContent3() {
        updateContent("Key insights and examples...");
        addVisualEffect('rotate');
      }
      
      function showConclusion() {
        updateContent("Summary and next steps...");
        addVisualEffect('scale');
      }
      
      function updateContent(text) {
        const content = document.getElementById('content');
        if (content) {
          content.innerHTML = '<p>' + text + '</p>';
          content.style.animation = 'fadeInUp 0.5s ease-out';
        }
      }
      
      function addVisualEffect(effect) {
        const elements = document.querySelectorAll('.interactive-element');
        elements.forEach(el => {
          el.style.animation = effect + ' 1s ease-in-out';
        });
      }
      
      function pauseAnimations() {
        document.querySelectorAll('*').forEach(el => {
          el.style.animationPlayState = 'paused';
        });
      }
      
      function resetAnimations() {
        document.querySelectorAll('*').forEach(el => {
          el.style.animationPlayState = 'running';
        });
        updateContent("Exploring the fascinating world of the topic...");
      }
      
      // Message listener for external control
      window.addEventListener('message', function(event) {
        switch(event.data.action) {
          case 'play':
            startSync();
            break;
          case 'pause':
            pauseSync();
            break;
          case 'stop':
            stopSync();
            break;
        }
      });
      
      // Auto-start when loaded
      window.addEventListener('load', function() {
        // Don't auto-start, wait for external control
        console.log('Video ready for playback');
      });
      
      // Add additional CSS animations
      const additionalStyles = document.createElement('style');
      additionalStyles.textContent = \`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .content p {
          transition: all 0.5s ease;
        }
      \`;
      document.head.appendChild(additionalStyles);
    </script>
  `;

  // Insert audio and sync script before closing body tag
  const finalHtml = htmlContent.replace(
    '</body>',
    audioElement + syncScript + '</body>'
  );

  return finalHtml;
}
