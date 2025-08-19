export interface ComponentState {
  html: string;
  css: string;
  javascript: string;
  props: Record<string, any>;
}

export const defaultTemplates = {
  html: `<div class="component-container">
  <h1 class="title">{{title}}</h1>
  <button class="btn btn-{{color}} btn-{{size}}" onclick="handleClick()">
    Click Me!
  </button>
  <p class="description">
    This is a live preview of your component. Edit the code to see changes in real-time!
  </p>
</div>`,

  css: `.component-container {
  max-width: 400px;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  color: white;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  display: inline-block;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.btn:active {
  transform: translateY(0);
}

/* Color variants */
.btn-blue { background: #3182ce; }
.btn-green { background: #38a169; }
.btn-red { background: #e53e3e; }
.btn-purple { background: #805ad5; }
.btn-orange { background: #dd6b20; }
.btn-teal { background: #319795; }
.btn-pink { background: #d53f8c; }
.btn-gray { background: #4a5568; }

/* Size variants */
.btn-xs { font-size: 0.75rem; padding: 0.5rem 1rem; }
.btn-sm { font-size: 0.875rem; padding: 0.625rem 1.25rem; }
.btn-md { font-size: 1rem; padding: 0.75rem 1.5rem; }
.btn-lg { font-size: 1.125rem; padding: 1rem 2rem; }
.btn-xl { font-size: 1.25rem; padding: 1.25rem 2.5rem; }

.description {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.5;
}`,

  javascript: `function handleClick() {
  alert('Button clicked! Props: ' + JSON.stringify(window.props, null, 2));
}

// You can access component props via window.props
console.log('Component props:', window.props);

// Example: Update content based on props
document.addEventListener('DOMContentLoaded', function() {
  // This code runs when the preview loads
  console.log('Component initialized with props:', window.props);
});`,
};

export const compileCode = (state: ComponentState): string => {
  let compiledHtml = state.html;
  
  // Replace prop placeholders in HTML
  Object.entries(state.props).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiledHtml = compiledHtml.replace(regex, String(value));
  });
  
  // Combine HTML with CSS in style tags
  let result = compiledHtml;
  
  if (state.css.trim()) {
    result = `<style>${state.css}</style>\n${result}`;
  }
  
  if (state.javascript.trim()) {
    result = `${result}\n<script>${state.javascript}</script>`;
  }
  
  return result;
};

export const validateCode = (code: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic HTML validation
  const openTags = code.match(/<[^/][^>]*>/g) || [];
  const closeTags = code.match(/<\/[^>]*>/g) || [];
  
  if (openTags.length !== closeTags.length) {
    errors.push('Mismatched HTML tags detected');
  }
  
  // Check for common JavaScript errors
  if (code.includes('{{') && code.includes('}}')) {
    errors.push('Unresolved template variables found');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};