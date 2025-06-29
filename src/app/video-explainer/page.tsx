"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  Square,
  Download,
  Wand2,
  Video,
  Volume2,
  Loader2,
  Sparkles,
  FileVideo,
  Mic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoGenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export default function VideoExplainerPage() {
  const [topic, setTopic] = React.useState("");
  const [duration, setDuration] = React.useState("60");
  const [style, setStyle] = React.useState("educational");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationSteps, setGenerationSteps] = React.useState<VideoGenerationStep[]>([]);
  const [generatedScript, setGeneratedScript] = React.useState("");
  const [audioUrl, setAudioUrl] = React.useState("");
  const [videoHtml, setVideoHtml] = React.useState("");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const videoRef = React.useRef<HTMLIFrameElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const initializeSteps = () => {
    const steps: VideoGenerationStep[] = [
      { id: 'script', name: 'Generating Script', status: 'pending', progress: 0 },
      { id: 'audio', name: 'Creating Audio', status: 'pending', progress: 0 },
      { id: 'animations', name: 'Building Animations', status: 'pending', progress: 0 },
      { id: 'sync', name: 'Syncing Audio & Video', status: 'pending', progress: 0 },
      { id: 'finalize', name: 'Finalizing Video', status: 'pending', progress: 0 },
    ];
    setGenerationSteps(steps);
    return steps;
  };

  const updateStep = (stepId: string, status: VideoGenerationStep['status'], progress: number) => {
    setGenerationSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, progress } : step
    ));
  };

  const generateExplainerVideo = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setCurrentStep(0);
    const steps = initializeSteps();

    try {
      // Step 1: Generate Script
      updateStep('script', 'processing', 20);
      const scriptResponse = await fetch('/api/video/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          duration: parseInt(duration),
          style,
        }),
      });

      if (!scriptResponse.ok) throw new Error('Script generation failed');
      const scriptData = await scriptResponse.json();
      setGeneratedScript(scriptData.script);
      updateStep('script', 'completed', 100);
      setCurrentStep(1);

      // Step 2: Generate Audio
      updateStep('audio', 'processing', 30);
      const audioResponse = await fetch('/api/video/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: scriptData.script,
          voice: 'alloy',
        }),
      });

      if (!audioResponse.ok) throw new Error('Audio generation failed');
      const audioData = await audioResponse.json();
      setAudioUrl(audioData.audioUrl);
      updateStep('audio', 'completed', 100);
      setCurrentStep(2);

      // Step 3: Generate Video Animations
      updateStep('animations', 'processing', 50);
      const videoResponse = await fetch('/api/video/generate-animations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          script: scriptData.script,
          duration: parseInt(duration),
          style,
        }),
      });

      if (!videoResponse.ok) throw new Error('Animation generation failed');
      const videoData = await videoResponse.json();
      updateStep('animations', 'completed', 100);
      setCurrentStep(3);

      // Step 4: Sync Audio and Video
      updateStep('sync', 'processing', 80);
      const syncResponse = await fetch('/api/video/sync-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent: videoData.htmlContent,
          audioUrl: audioData.audioUrl,
          duration: parseInt(duration),
        }),
      });

      if (!syncResponse.ok) throw new Error('Sync failed');
      const syncData = await syncResponse.json();
      setVideoHtml(syncData.finalHtml);
      updateStep('sync', 'completed', 100);
      setCurrentStep(4);

      // Step 5: Finalize
      updateStep('finalize', 'processing', 90);
      setTimeout(() => {
        updateStep('finalize', 'completed', 100);
        setIsGenerating(false);
      }, 1000);

    } catch (error) {
      console.error('Video generation error:', error);
      const currentStepId = steps[currentStep]?.id;
      if (currentStepId) {
        updateStep(currentStepId, 'error', 0);
      }
      setIsGenerating(false);
    }
  };

  const playVideo = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      // Send play message to iframe
      videoRef.current.contentWindow?.postMessage({ action: 'play' }, '*');
    }
  };

  const pauseVideo = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Send pause message to iframe
      videoRef.current.contentWindow?.postMessage({ action: 'pause' }, '*');
    }
  };

  const stopVideo = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      
      // Send stop message to iframe
      videoRef.current.contentWindow?.postMessage({ action: 'stop' }, '*');
    }
  };

  const downloadVideo = () => {
    if (videoHtml && audioUrl) {
      const blob = new Blob([videoHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic.replace(/\s+/g, '_')}_explainer.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Video Explainer
          </h1>
        </motion.div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create engaging animated explainer videos with AI-generated scripts and audio for any topic
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Video Configuration
            </CardTitle>
            <CardDescription>
              Configure your explainer video settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Machine Learning, Photosynthesis, Quantum Physics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="90">1.5 minutes</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Animation Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateExplainerVideo}
              disabled={!topic.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Explainer Video
                </>
              )}
            </Button>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="space-y-4">
                <div className="text-sm font-medium">Generation Progress</div>
                {generationSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{step.name}</span>
                      <Badge
                        variant={
                          step.status === 'completed' ? 'default' :
                          step.status === 'processing' ? 'secondary' :
                          step.status === 'error' ? 'destructive' : 'outline'
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>
                    <Progress value={step.progress} className="h-2" />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5" />
              Video Preview
            </CardTitle>
            <CardDescription>
              Preview and control your generated explainer video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {videoHtml ? (
              <>
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    ref={videoRef}
                    srcDoc={videoHtml}
                    className="w-full h-full"
                    title="Generated Explainer Video"
                  />
                </div>

                {/* Audio Element */}
                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                )}

                {/* Video Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={playVideo}
                    disabled={isPlaying}
                    variant="outline"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    onClick={pauseVideo}
                    disabled={!isPlaying}
                    variant="outline"
                    size="sm"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopVideo}
                    variant="outline"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button
                    onClick={downloadVideo}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">No video generated yet</p>
                    <p className="text-sm text-muted-foreground">
                      Enter a topic and click "Generate Explainer Video" to start
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Script */}
      {generatedScript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Generated Script
            </CardTitle>
            <CardDescription>
              AI-generated script for your explainer video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedScript}
              readOnly
              className="min-h-[200px] resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
