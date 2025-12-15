/**
 * Technologies Input Component
 * Tag/chip input for technologies array
 * 
 * Features:
 * - Text input with Enter or Add button
 * - Display as removable chips/tags
 * - No duplicates allowed
 */
import { useState } from 'react'
import { Button, Badge, Form, InputGroup } from 'react-bootstrap'
import { Icon } from '@iconify/react'

interface TechnologiesInputProps {
  value: string[] | null
  onChange: (technologies: string[] | null) => void
}

export const TechnologiesInput = ({ value, onChange }: TechnologiesInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const technologies = value || []

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    
    // Check for duplicates (case-insensitive)
    if (technologies.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('')
      return
    }

    onChange([...technologies, trimmed])
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (index: number) => {
    const newTechnologies = technologies.filter((_, i) => i !== index)
    onChange(newTechnologies.length > 0 ? newTechnologies : null)
  }

  return (
    <div>
      <InputGroup className="mb-2">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add technology..."
          size="sm"
        />
        <Button 
          variant="outline-primary" 
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          size="sm"
        >
          <Icon icon="mingcute:add-line" />
        </Button>
      </InputGroup>

      {technologies.length > 0 && (
        <div className="d-flex flex-wrap gap-1">
          {technologies.map((tech, index) => (
            <Badge 
              key={index} 
              bg="light" 
              text="dark"
              className="d-flex align-items-center gap-1 pe-1"
              style={{ fontSize: '0.75rem' }}
            >
              {tech}
              <Button
                variant="link"
                size="sm"
                className="p-0 text-danger"
                onClick={() => handleRemove(index)}
                style={{ lineHeight: '1' }}
              >
                <Icon icon="mingcute:close-line" style={{ fontSize: '12px' }} />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <Form.Text className="text-muted">
        Press Enter or click + to add
      </Form.Text>
    </div>
  )
}
