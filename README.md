
# FilterWeave - Interactive Data Filter Builder for KendoReact

[![KendoReact](https://img.shields.io/badge/KendoReact-%5E5.0.0-blue)](https://www.telerik.com/kendo-react-ui/)
[![React](https://img.shields.io/badge/React-%5E18.2.0-blue)](https://react.dev/)

A configurable filter builder component that creates complex nested filters using KendoReact components. Winner candidate for the KendoReact Free Components Challenge.

![FilterWeave Demo](https://via.placeholder.com/800x400.png?text=FilterWeave+Demo+Interface)

## Features

- 🧩 **KendoReact Integration** - Built with KendoReact DropDownList, Button, and Grid components
- 🔧 **Fully Configurable** - Customize fields, operators, styling, and output formats
- 🌳 **Nested Filter Groups** - Create AND/OR logic trees with unlimited nesting
- 🎨 **Theme Support** - Works with all KendoReact themes (Material, Bootstrap, Fluent)
- ♿ **Accessibility First** - WCAG 2.1 compliant with ARIA labels

## Installed KendoReact Components
- `@progress/kendo-react-buttons`
- `@progress/kendo-react-dropdowns` 
- `@progress/kendo-react-inputs`
- `@progress/kendo-react-data-tools`

## Installation

```bash
git clone https://github.com/yourusername/filterweave.git
cd filterweave
npm install
npm run dev
```

## Usage

```tsx
import { InteractiveDataFilterBuilder } from './components/filter/InteractiveDataFilterBuilder';

const fields = [
  { name: 'username', label: 'User Name', dataType: 'string' },
  { name: 'createdAt', label: 'Creation Date', dataType: 'date' }
];

function App() {
  return (
    <InteractiveDataFilterBuilder
      fieldsConfig={fields}
      onFilterChange={(filter) => console.log(filter)}
      outputFormat="query"
    />
  );
}
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `fieldsConfig` | `FieldConfig[]` | Configure filterable fields (name, label, dataType) |
| `defaultOperators` | `OperatorConfig[]` | Custom comparison operators |
| `outputFormat` | `'structured' | 'query'` | Output as JSON object or query string |
| `styles` | `StylesConfig` | Custom CSS for components |
| `accessibilityLabels` | `AccessibilityLabels` | ARIA labels for accessibility |

## Contest Requirements Checklist

✅ **KendoReact Components Used**  
- DropDownList (Filter operator selection)  
- Button (Add conditions/groups)  
- Grid (Data display - in companion DataGrid component)

✅ **Original Component**  
Unique implementation of nested filter builder with configurable output formats

✅ **Dev.to Article**  
[Read the implementation journey](https://dev.to/yourusername/filterweave-story) (Post submission URL)

✅ **Working Demo**  
[Live CodeSandbox Demo](https://codesandbox.io/your-demo-link)

## Development

```bash
npm run build
npm run lint
npm run test
```
