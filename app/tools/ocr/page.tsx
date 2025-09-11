'use client';

import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  Eye,
  FileImage,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

// Tesseract will be loaded from CDN
declare global {
  interface Window {
    Tesseract: any;
  }
}

interface ProcessedImage {
  id: string;
  file: File;
  preview: string;
  text: string;
  confidence: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export default function OCRApp() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [workerReady, setWorkerReady] = useState(false);
  const [tesseractLoaded, setTesseractLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<any>(null);

  // Load Tesseract.js from CDN
  useEffect(() => {
    if (window.Tesseract) {
      setTesseractLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js';
    script.onload = () => {
      setTesseractLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Tesseract.js');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize Tesseract worker
  const initializeWorker = useCallback(async () => {
    if (workerRef.current || !tesseractLoaded) {
      return;
    }

    setIsInitializing(true);
    try {
      const worker = await window.Tesseract.createWorker('eng');
      workerRef.current = worker;
      setWorkerReady(true);
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [tesseractLoaded]);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) {
      return;
    }

    const newImages: ProcessedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        newImages.push({
          id,
          file,
          preview,
          text: '',
          confidence: 0,
          status: 'pending',
          progress: 0,
        });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Process single image with OCR
  const processImage = useCallback(
    async (imageId: string) => {
      if (!tesseractLoaded) {
        alert('Tesseract.js is still loading. Please wait a moment.');
        return;
      }

      if (!workerRef.current) {
        await initializeWorker();
      }

      if (!workerRef.current) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  status: 'error',
                  error: 'Failed to initialize OCR worker',
                }
              : img
          )
        );
        return;
      }

      const image = images.find((img) => img.id === imageId);
      if (!image || image.status === 'processing') {
        return;
      }

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, status: 'processing', progress: 0, error: undefined }
            : img
        )
      );

      try {
        const {
          data: { text, confidence },
        } = await workerRef.current.recognize(image.file, {
          logger: (m: any) => {
            console.log(m);
            if (m.status === 'recognizing text') {
              const progress = Math.round(m.progress * 100);
              setImages((prev) =>
                prev.map((img) =>
                  img.id === imageId ? { ...img, progress } : img
                )
              );
            }
          },
        });

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  text: text.trim(),
                  confidence: Math.round(confidence),
                  status: 'completed',
                  progress: 100,
                }
              : img
          )
        );
      } catch (error) {
        console.error('OCR processing failed:', error);
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  status: 'error',
                  progress: 0,
                  error:
                    error instanceof Error
                      ? error.message
                      : 'Processing failed',
                }
              : img
          )
        );
      }
    },
    [images, initializeWorker, tesseractLoaded]
  );

  // Process all pending images
  const processAllImages = useCallback(async () => {
    const pendingImages = images.filter((img) => img.status === 'pending');
    for (const image of pendingImages) {
      await processImage(image.id);
    }
  }, [images, processImage]);

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === imageId);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  }, []);

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  // Export all text
  const exportAllText = useCallback(() => {
    const allText = images
      .filter((img) => img.status === 'completed' && img.text)
      .map(
        (img, index) =>
          `=== Image ${index + 1}: ${img.file.name} ===\nConfidence: ${
            img.confidence
          }%\n\n${img.text}`
      )
      .join('\n\n' + '='.repeat(50) + '\n\n');

    const blob = new Blob([allText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-results-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [images]);

  // Clear all images
  const clearAllImages = useCallback(() => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });
    setImages([]);
  }, [images]);

  // Retry processing failed image
  const retryProcessing = useCallback((imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? { ...img, status: 'pending', error: undefined, progress: 0 }
          : img
      )
    );
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const completedImages = images.filter(
    (img) => img.status === 'completed'
  ).length;
  const processingImages = images.filter(
    (img) => img.status === 'processing'
  ).length;
  const pendingImages = images.filter((img) => img.status === 'pending').length;
  const errorImages = images.filter((img) => img.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br p-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white-200 mb-2">
            Offline OCR Scanner
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Upload multiple images and extract text using advanced OCR
            technology. Everything processes locally - no internet required
            after initial load.
          </p>
        </div>

        {/* Loading State */}
        {!tesseractLoaded && (
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Loading Tesseract.js OCR engine... Please wait.
            </AlertDescription>
          </Alert>
        )}

        {/* Status */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              {images.length} Total Images
            </Badge>
            {pendingImages > 0 && (
              <Badge variant="outline" className="px-3 py-1">
                {pendingImages} Pending
              </Badge>
            )}
            {processingImages > 0 && (
              <Badge
                variant="default"
                className="px-3 py-1 bg-blue-100 text-blue-800 border-blue-200"
              >
                {processingImages} Processing
              </Badge>
            )}
            {completedImages > 0 && (
              <Badge
                variant="default"
                className="px-3 py-1 bg-green-100 text-green-800 border-green-200"
              >
                {completedImages} Completed
              </Badge>
            )}
            {errorImages > 0 && (
              <Badge
                variant="default"
                className="px-3 py-1 bg-red-100 text-red-800 border-red-200"
              >
                {errorImages} Failed
              </Badge>
            )}
          </div>
        )}

        {/* Upload Area */}
        <Card className="mb-3">
          <CardContent className="p-6">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload Images for OCR
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop images here or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports: JPG, PNG, GIF, BMP, TIFF, WEBP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <Button
                  onClick={processAllImages}
                  disabled={
                    pendingImages === 0 ||
                    processingImages > 0 ||
                    isInitializing ||
                    !tesseractLoaded
                  }
                  className="px-6"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Initializing OCR...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Process {pendingImages} Images
                    </>
                  )}
                </Button>
                {completedImages > 0 && (
                  <Button
                    variant="outline"
                    onClick={exportAllText}
                    className="px-6"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Text
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={clearAllImages}
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Worker Status */}
        {isInitializing && (
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Initializing OCR engine... This may take a moment on first use.
            </AlertDescription>
          </Alert>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 truncate">
                      <FileImage className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate" title={image.file.name}>
                        {image.file.name}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {image.status === 'completed' && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {image.confidence}%
                        </Badge>
                      )}
                      {image.status === 'processing' && (
                        <Badge
                          variant="default"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border bg-gray-50"
                      loading="lazy"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-black/60 text-white border-none"
                    >
                      {(image.file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>

                  {/* Processing Progress */}
                  {image.status === 'processing' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                        <span className="text-gray-500">{image.progress}%</span>
                      </div>
                      <Progress value={image.progress} className="h-2" />
                    </div>
                  )}

                  {/* Process Button */}
                  {image.status === 'pending' && (
                    <Button
                      onClick={() => processImage(image.id)}
                      disabled={
                        processingImages > 0 ||
                        isInitializing ||
                        !tesseractLoaded
                      }
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Extract Text
                    </Button>
                  )}

                  {/* Error State */}
                  {image.status === 'error' && (
                    <div className="space-y-3">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {image.error || 'Failed to process this image.'}
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => retryProcessing(image.id)}
                        disabled={
                          processingImages > 0 ||
                          isInitializing ||
                          !tesseractLoaded
                        }
                        variant="outline"
                        className="w-full"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {/* Extracted Text */}
                  {image.status === 'completed' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">
                          Extracted Text:
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(image.text)}
                          disabled={!image.text}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={image.text || 'No text detected'}
                        readOnly
                        className="min-h-[120px] resize-none bg-gray-50"
                        placeholder="No text detected in this image"
                      />
                      {image.text && (
                        <p className="text-xs text-gray-500">
                          {image.text.length} characters •{' '}
                          {image.text.split(/\s+/).length} words
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <Card className="text-center p-12">
            <CardContent>
              <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Images Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Upload some images to get started with text recognition. The OCR
                engine will extract all readable text automatically.
              </p>
              <p className="text-sm text-gray-400">
                Supports multiple formats: JPG, PNG, GIF, BMP, TIFF, WEBP
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Powered by Tesseract.js • All processing happens locally in your
            browser
          </p>
          <p className="mt-1">
            No data is sent to external servers • Your privacy is protected
          </p>
        </div>
      </div>
    </div>
  );
}
