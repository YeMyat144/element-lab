import React, { useState } from 'react';
import {  VStack,  FormControl,  FormLabel,  Input,  Select,  Switch,  NumberInput,  NumberInputField,  NumberInputStepper,  NumberIncrementStepper,  NumberDecrementStepper,  Textarea,  Box,  Text,  Divider,  Button,  HStack,  IconButton,  useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Badge } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'size';
  value: any;
}

interface PropsEditorProps {
  props: Record<string, any>;
  onChange: (props: Record<string, any>) => void;
}

const PropsEditor: React.FC<PropsEditorProps> = ({ props, onChange }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProp, setEditingProp] = useState<PropDefinition | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Convert props object to array of prop definitions
  const getPropDefinitions = (): PropDefinition[] => {
    return Object.entries(props).map(([name, value]) => {
      let type: PropDefinition['type'] = 'string';
      
      if (typeof value === 'number') type = 'number';
      else if (typeof value === 'boolean') type = 'boolean';
      else if (name === 'color') type = 'color';
      else if (name === 'size') type = 'size';
      
      return { name, type, value };
    });
  };

  const updateProps = (propDefinitions: PropDefinition[]) => {
    const newProps: Record<string, any> = {};
    propDefinitions.forEach(prop => {
      newProps[prop.name] = prop.value;
    });
    onChange(newProps);
  };

  const addProp = () => {
    setEditingProp({
      name: `prop${Object.keys(props).length + 1}`,
      type: 'string',
      value: ''
    });
    setIsEditing(false);
    onOpen();
  };

  const editProp = (prop: PropDefinition) => {
    setEditingProp(prop);
    setIsEditing(true);
    onOpen();
  };

  const removeProp = (propName: string) => {
    const propDefinitions = getPropDefinitions().filter(p => p.name !== propName);
    updateProps(propDefinitions);
  };

  const saveProp = () => {
    if (!editingProp) return;

    const propDefinitions = getPropDefinitions();
    
    if (isEditing) {
      // Update existing prop
      const index = propDefinitions.findIndex(p => p.name === editingProp.name);
      if (index !== -1) {
        propDefinitions[index] = editingProp;
      }
    } else {
      // Add new prop
      propDefinitions.push(editingProp);
    }
    
    updateProps(propDefinitions);
    onClose();
    setEditingProp(null);
  };

  const getTypeColor = (type: PropDefinition['type']) => {
    switch (type) {
      case 'string': return 'blue';
      case 'number': return 'green';
      case 'boolean': return 'purple';
      case 'color': return 'pink';
      case 'size': return 'orange';
      default: return 'gray';
    }
  };

  const renderValueEditor = (prop: PropDefinition, onChange: (value: any) => void) => {
    switch (prop.type) {
      case 'string':
        return (
          <FormControl>
            <FormLabel fontSize="xs">String Value</FormLabel>
            {typeof prop.value === 'string' && prop.value.length > 50 ? (
              <Textarea
                value={prop.value}
                onChange={(e) => onChange(e.target.value)}
                size="sm"
                rows={3}
              />
            ) : (
              <Input
                value={prop.value}
                onChange={(e) => onChange(e.target.value)}
                size="sm"
              />
            )}
          </FormControl>
        );

      case 'number':
        return (
          <FormControl>
            <FormLabel fontSize="xs">Number Value</FormLabel>
            <NumberInput
              value={prop.value}
              onChange={(_, valueAsNumber) => onChange(valueAsNumber || 0)}
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        );

      case 'boolean':
        return (
          <FormControl display="flex" alignItems="center">
            <FormLabel fontSize="xs" mb="0">
              Boolean Value
            </FormLabel>
            <Switch
              isChecked={prop.value}
              onChange={(e) => onChange(e.target.checked)}
              size="sm"
            />
          </FormControl>
        );

      case 'color':
        return (
          <FormControl>
            <FormLabel fontSize="xs">Color</FormLabel>
            <Select
              value={prop.value}
              onChange={(e) => onChange(e.target.value)}
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
        );

      case 'size':
        return (
          <FormControl>
            <FormLabel fontSize="xs">Size</FormLabel>
            <Select
              value={prop.value}
              onChange={(e) => onChange(e.target.value)}
              size="sm"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  const renderPropCard = (prop: PropDefinition) => {
    return (
      <Box key={prop.name} p={4} bg={bgColor} borderRadius="md" position="relative">
        <HStack justify="space-between" mb={3}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="medium">
              {prop.name}
            </Text>
            <Badge colorScheme={getTypeColor(prop.type)} size="sm">
              {prop.type}
            </Badge>
          </VStack>
          <HStack spacing={2}>
            <IconButton
              aria-label="Edit property"
              icon={<EditIcon />}
              size="xs"
              variant="ghost"
              onClick={() => editProp(prop)}
            />
            <IconButton
              aria-label="Remove property"
              icon={<DeleteIcon />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => removeProp(prop.name)}
            />
          </HStack>
        </HStack>

        <Box>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Current Value:
          </Text>
          {renderValueEditor(prop, (value) => {
            const propDefinitions = getPropDefinitions();
            const index = propDefinitions.findIndex(p => p.name === prop.name);
            if (index !== -1) {
              propDefinitions[index] = { ...prop, value };
              updateProps(propDefinitions);
            }
          })}
        </Box>
      </Box>
    );
  };

  return (
    <>
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

        {getPropDefinitions().map(renderPropCard)}

        {Object.keys(props).length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            <Text fontSize="sm">
              No props defined. Click "Add Prop" to get started.
            </Text>
          </Box>
        )}
      </VStack>

      {/* Add/Edit Prop Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingProp && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Property Name</FormLabel>
                  <Input
                    value={editingProp.name}
                    onChange={(e) => setEditingProp({ ...editingProp, name: e.target.value })}
                    placeholder="Enter property name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    value={editingProp.type}
                    onChange={(e) => {
                      const newType = e.target.value as PropDefinition['type'];
                      let newValue: any = '';
                      
                      // Set default value based on type
                      switch (newType) {
                        case 'number': newValue = 0; break;
                        case 'boolean': newValue = false; break;
                        case 'color': newValue = 'blue'; break;
                        case 'size': newValue = 'md'; break;
                        default: newValue = '';
                      }
                      
                      setEditingProp({ ...editingProp, type: newType, value: newValue });
                    }}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                  </Select>
                </FormControl>

                {renderValueEditor(editingProp, (value) => 
                  setEditingProp({ ...editingProp, value })
                )}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={saveProp}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PropsEditor;