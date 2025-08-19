import React from 'react';
import { VStack, FormControl, FormLabel, Input, Select, Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Textarea, Box, Text, Divider, Button, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

interface PropsEditorProps {
  props: Record<string, any>;
  onChange: (props: Record<string, any>) => void;
}

const PropsEditor: React.FC<PropsEditorProps> = ({ props, onChange }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const updateProp = (key: string, value: any) => {
    onChange({
      ...props,
      [key]: value,
    });
  };

  const addProp = () => {
    const newKey = `prop${Object.keys(props).length + 1}`;
    onChange({
      ...props,
      [newKey]: '',
    });
  };

  const removeProp = (key: string) => {
    const newProps = { ...props };
    delete newProps[key];
    onChange(newProps);
  };

  const renderPropEditor = (key: string, value: any) => {
    const valueType = typeof value;

    return (
      <Box key={key} p={4} bg={bgColor} borderRadius="md" position="relative">
        <HStack justify="space-between" mb={3}>
          <Text fontSize="sm" fontWeight="medium">
            {key}
          </Text>
          <IconButton
            aria-label="Remove property"
            icon={<DeleteIcon />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={() => removeProp(key)}
          />
        </HStack>

        {valueType === 'string' && (
          <FormControl>
            <FormLabel fontSize="xs">String Value</FormLabel>
            {value.length > 50 ? (
              <Textarea
                value={value}
                onChange={(e) => updateProp(key, e.target.value)}
                size="sm"
                rows={3}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => updateProp(key, e.target.value)}
                size="sm"
              />
            )}
          </FormControl>
        )}

        {valueType === 'number' && (
          <FormControl>
            <FormLabel fontSize="xs">Number Value</FormLabel>
            <NumberInput
              value={value}
              onChange={(_, valueAsNumber) => updateProp(key, valueAsNumber || 0)}
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        )}

        {valueType === 'boolean' && (
          <FormControl display="flex" alignItems="center">
            <FormLabel fontSize="xs" mb="0">
              Boolean Value
            </FormLabel>
            <Switch
              isChecked={value}
              onChange={(e) => updateProp(key, e.target.checked)}
              size="sm"
            />
          </FormControl>
        )}

        {key === 'color' && (
          <FormControl>
            <FormLabel fontSize="xs">Color</FormLabel>
            <Select
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              size="sm"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="teal">Teal</option>
              <option value="pink">Pink</option>
              <option value="gray">Gray</option>
            </Select>
          </FormControl>
        )}

        {key === 'size' && (
          <FormControl>
            <FormLabel fontSize="xs">Size</FormLabel>
            <Select
              value={value}
              onChange={(e) => updateProp(key, e.target.value)}
              size="sm"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </Select>
          </FormControl>
        )}
      </Box>
    );
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          Component Props
        </Text>
        <Button
          leftIcon={<AddIcon />}
          onClick={addProp}
          size="sm"
          variant="outline"
        >
          Add Prop
        </Button>
      </HStack>

      <Divider />

      {Object.entries(props).map(([key, value]) =>
        renderPropEditor(key, value)
      )}

      {Object.keys(props).length === 0 && (
        <Box textAlign="center" py={8} color="gray.500">
          <Text fontSize="sm">
            No props defined. Click "Add Prop" to get started.
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default PropsEditor;