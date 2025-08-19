import React, { useState, useCallback, useEffect } from 'react';
import { Box, Flex, HStack, Text, Button, IconButton, useColorMode, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, useToast } from '@chakra-ui/react';
import { SunIcon, MoonIcon, DownloadIcon, CopyIcon, ViewIcon, EditIcon } from '@chakra-ui/icons';
import CodeEditor from './CodeEditor';
import PreviewPanel from './PreviewPanel';
import PropsEditor from './PropsEditor';
import { compileCode, defaultTemplates } from '../utils/codeCompiler';

interface ComponentState { 
  html: string;
  css: string;
  javascript: string;
  props: Record<string, any>;
}

const Playground: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const [componentState, setComponentState] = useState<ComponentState>({
    html: defaultTemplates.html,
    css: defaultTemplates.css,
    javascript: defaultTemplates.javascript,
    props: { title: 'Hello ElementLab!', color: 'blue', size: 'md' },
  });

  const [compiledCode, setCompiledCode] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleCodeChange = useCallback(
    (type: keyof ComponentState, value: string) => {
      setComponentState((prev) => ({
        ...prev,
        [type]: value,
      }));
    },
    []
  );

  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    setComponentState((prev) => ({
      ...prev,
      props: newProps,
    }));
  }, []);

  useEffect(() => {
    const compiled = compileCode(componentState);
    setCompiledCode(compiled);
  }, [componentState]);

  const handleExport = () => {
    const exportData = {
      ...componentState,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ElementLab-component.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Component Exported',
      description: 'Your component has been downloaded as a JSON file.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(compiledCode);
    toast({
      title: 'Code Copied',
      description: 'The compiled code has been copied to your clipboard.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        py={4}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack spacing={4}>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="brand.500">
            ElementLab
          </Text>
          <Badge colorScheme="brand" variant="subtle">
            Live Playground
          </Badge>
        </HStack>

        <HStack spacing={2}>
          <IconButton
            aria-label="Toggle preview mode"
            icon={isPreviewMode ? <EditIcon /> : <ViewIcon />}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            variant="ghost"
            size={{ base: 'sm', md: 'md' }}
          />
          <IconButton
            aria-label="Copy code"
            icon={<CopyIcon />}
            onClick={handleCopyCode}
            variant="ghost"
            size={{ base: 'sm', md: 'md' }}
          />
          <Button
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
            variant="outline"
            size={{ base: 'xs', md: 'sm' }}
          >
            Export
          </Button>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size={{ base: 'sm', md: 'md' }}
          />
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex
        flex={1}
        h="calc(100vh - 80px)"
        direction={{ base: 'column', md: 'row' }}
      >
        {!isPreviewMode ? (
          <>
            {/* Left Panel - Code Editors */}
            <Box
              w={{ base: '100%', md: '50%' }}
              borderRight={{ base: '0', md: '1px' }}
              borderBottom={{ base: '1px', md: '0' }}
              borderColor={borderColor}
              h={{ base: '50%', md: 'auto' }}
            >
              <Tabs h="full" orientation="horizontal">
                <TabList
                  bg={bgColor}
                  borderBottom="1px"
                  borderColor={borderColor}
                  overflowX="auto"
                >
                  <Tab>HTML</Tab>
                  <Tab>CSS</Tab>
                  <Tab>JavaScript</Tab>
                  <Tab>Props</Tab>
                </TabList>

                <TabPanels h="calc(100% - 42px)">
                  <TabPanel p={0} h="full">
                    <CodeEditor
                      language="html"
                      value={componentState.html}
                      onChange={(value) => handleCodeChange('html', value)}
                    />
                  </TabPanel>

                  <TabPanel p={0} h="full">
                    <CodeEditor
                      language="css"
                      value={componentState.css}
                      onChange={(value) => handleCodeChange('css', value)}
                    />
                  </TabPanel>

                  <TabPanel p={0} h="full">
                    <CodeEditor
                      language="javascript"
                      value={componentState.javascript}
                      onChange={(value) => handleCodeChange('javascript', value)}
                    />
                  </TabPanel>

                  <TabPanel p={4} h="full" overflowY="auto">
                    <PropsEditor
                      props={componentState.props}
                      onChange={handlePropsChange}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {/* Right Panel - Preview */}
            <Box w={{ base: '100%', md: '50%' }} flex="1">
              <PreviewPanel
                compiledCode={compiledCode}
                props={componentState.props}
              />
            </Box>
          </>
        ) : (
          /* Full Preview Mode */
          <Box w="full" flex="1">
            <PreviewPanel
              compiledCode={compiledCode}
              props={componentState.props}
              isFullscreen={true}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Playground;
