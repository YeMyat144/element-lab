import React, { useRef, useEffect, useState } from 'react';
import { Box, VStack, Text, Alert, AlertIcon, AlertDescription, useColorModeValue, Spinner, Center } from '@chakra-ui/react';

interface PreviewPanelProps {
  compiledCode: string;
  props: Record<string, any>;
  isFullscreen?: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ 
  compiledCode, 
  props, 
  isFullscreen = false 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (iframeRef.current && compiledCode) {
      setIsLoading(true);
      setError(null);
      
      try {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument;
        
        if (doc) {
          // Create the HTML document with proper styling and error handling
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                * {
                  box-sizing: border-box;
                }
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  background: ${bgColor === 'white' ? '#ffffff' : '#1a202c'};
                  color: ${bgColor === 'white' ? '#1a202c' : '#ffffff'};
                  line-height: 1.5;
                }
                .preview-container {
                  min-height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .error {
                  color: #e53e3e;
                  background: #fed7d7;
                  padding: 16px;
                  border-radius: 8px;
                  border: 1px solid #feb2b2;
                  font-family: monospace;
                  white-space: pre-wrap;
                }
                ${compiledCode.includes('<style>') ? '' : compiledCode}
              </style>
            </head>
            <body>
              <div class="preview-container">
                <div id="app">${compiledCode.includes('<style>') ? compiledCode.split('<style>')[0] : compiledCode}</div>
              </div>
              <script>
                window.onerror = function(msg, url, lineNo, columnNo, error) {
                  document.getElementById('app').innerHTML = 
                    '<div class="error">Error: ' + msg + '</div>';
                  return false;
                };
                
                try {
                  // Inject props as global variables
                  window.props = ${JSON.stringify(props)};
                  
                  // Execute any JavaScript code
                  ${compiledCode.includes('<script>') ? 
                    compiledCode.split('<script>')[1]?.split('</script>')[0] || '' : 
                    ''
                  }
                  
                  // Signal that loading is complete
                  window.parent.postMessage({ type: 'loaded' }, '*');
                } catch (e) {
                  document.getElementById('app').innerHTML = 
                    '<div class="error">JavaScript Error: ' + e.message + '</div>';
                  window.parent.postMessage({ type: 'error', error: e.message }, '*');
                }
              </script>
            </body>
            </html>
          `;
          
          doc.open();
          doc.write(htmlContent);
          doc.close();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    }
  }, [compiledCode, props]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'loaded') {
        setIsLoading(false);
      } else if (event.data.type === 'error') {
        setError(event.data.error);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <VStack h="full" spacing={0} align="stretch">
      {!isFullscreen && (
        <Box
          px={4}
          py={3}
          bg={bgColor}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Live Preview
          </Text>
        </Box>
      )}
      
      <Box flex={1} position="relative" bg={bgColor}>
        {isLoading && (
          <Center position="absolute" top={0} left={0} right={0} bottom={0} zIndex={2}>
            <Spinner size="lg" color="brand.500" />
          </Center>
        )}
        
        {error && (
          <Box p={4}>
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </Box>
        )}
        
        <Box
          as="iframe"
          ref={iframeRef}
          w="full"
          h="full"
          border="none"
          bg="transparent"
          opacity={isLoading ? 0.3 : 1}
          transition="opacity 0.2s"
        />
      </Box>
    </VStack>
  );
};

export default PreviewPanel;