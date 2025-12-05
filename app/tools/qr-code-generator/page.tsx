'use client';

import {
  Code,
  Copy,
  Download,
  Link,
  Loader2,
  QrCode,
  Type,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type InputType = 'url' | 'text' | 'code';

declare global {
  interface Window {
    QRCode: {
      toCanvas: (
        canvas: HTMLCanvasElement,
        text: string,
        options: {
          width: number;
          margin: number;
          errorCorrectionLevel: string;
        }
      ) => Promise<void>;
      toDataURL: (
        text: string,
        options: {
          width: number;
          margin: number;
          errorCorrectionLevel: string;
        }
      ) => Promise<string>;
    };
  }
}

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState<InputType>('url');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load QRCode library from CDN
  useEffect(() => {
    if (window.QRCode) {
      setLibraryLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/qrcode@1.2.0/build/qrcode.min.js';
    script.onload = () => {
      setLibraryLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load QR code library');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const generateQRCode = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate a QR code');
      return;
    }

    if (!libraryLoaded) {
      setError('QR code library is still loading. Please wait.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      // Generate QR code on canvas
      await window.QRCode.toCanvas(canvas, inputText, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'M',
      });

      // Also generate data URL for download
      const dataUrl = await window.QRCode.toDataURL(inputText, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      setQrCodeData(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to generate QR code'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, libraryLoaded]);

  const downloadQRCode = useCallback(() => {
    if (!qrCodeData) {
      return;
    }

    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qrcode-${inputType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCodeData, inputType]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inputText);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        console.error(error.stack);
      }

      const textArea = document.createElement('textarea');
      textArea.value = inputText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [inputText]);

  const clearAll = useCallback(() => {
    setInputText('');
    setQrCodeData(null);
    setError(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const getPlaceholder = () => {
    switch (inputType) {
      case 'url':
        return 'Enter URL (e.g., https://example.com)';
      case 'code':
        return 'Enter code or reference number';
      case 'text':
      default:
        return 'Enter any text';
    }
  };

  const getIcon = () => {
    switch (inputType) {
      case 'url':
        return <Link className="w-5 h-5" />;
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'text':
      default:
        return <Type className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen p-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">QR Code Generator</h1>
          <p className="max-w-2xl mx-auto">
            Generate QR codes for URLs, text, or codes. Scan with any QR code
            reader to access your content instantly.
          </p>
        </div>

        {!libraryLoaded && (
          <Alert className="mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Loading QR code library... Please wait.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon()}
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="input-type" className="text-sm font-medium">
                  Content Type
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={inputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInputType('url')}
                    className="flex-1"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setInputType('text')}
                    className="flex-1"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Text
                  </Button>
                  <Button
                    type="button"
                    variant={inputType === 'code' ? 'default' : 'outline'}
                    onClick={() => setInputType('code')}
                    className="flex-1"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="input-text" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="min-h-[200px] resize-none"
                />
                {inputText && (
                  <p className="text-xs">{inputText.length} characters</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={generateQRCode}
                  disabled={!libraryLoaded || isGenerating || !inputText.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
                {inputText && (
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    size="icon"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {inputText && (
                <Button variant="outline" onClick={clearAll} className="w-full">
                  Clear All
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center min-h-[300px] rounded-lg border-2 border-dashed">
                <div className="p-4">
                  <canvas
                    ref={canvasRef}
                    className={qrCodeData ? 'max-w-full' : 'hidden'}
                  />
                  {!qrCodeData && (
                    <div className="text-center p-8">
                      <QrCode className="w-16 h-16 mx-auto mb-4" />
                      <p>
                        {libraryLoaded
                          ? 'Enter text and click Generate to create your QR code'
                          : 'Loading QR code library...'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {qrCodeData && (
                <div className="space-y-2">
                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <p className="text-xs text-center">PNG format • 400x400px</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm">
          <p>
            Powered by qrcode.js • Generated QR codes work with all standard QR
            readers
          </p>
          <p className="mt-1">
            All processing happens locally in your browser • No data is stored
          </p>
        </div>
      </div>
    </div>
  );
}
