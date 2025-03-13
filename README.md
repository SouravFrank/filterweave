
# FilterWeave - Interactive Data Filter Builder for KendoReact

[![KendoReact](https://img.shields.io/badge/KendoReact-%5E10.0.0-blue)](https://www.telerik.com/kendo-react-ui/)
[![React](https://img.shields.io/badge/React-%5E19.0.0-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-%5E6.2.0-orange)](https://vitejs.dev/)

A configurable filter builder component that creates complex nested filters using KendoReact components. Winner candidate for the KendoReact Free Components Challenge.

![FilterWeave Demo](https://via.placeholder.com/800x400.png?text=FilterWeave+Demo+Interface)

## Features

- 🧩 **Full KendoReact Suite** - Integrated with Buttons, DropDowns, Grid, and Data Tools
- ⚡ **Vite-Powered** - Fast development workflow with hot module replacement
- 🚀 **Production Ready** - Optimized build configuration included

## Installed KendoReact Components
- `@progress/kendo-react-buttons@^10.0.0`
- `@progress/kendo-react-dropdowns@^10.0.0`
- `@progress/kendo-react-inputs@^10.0.0`
- `@progress/kendo-react-data-tools@^10.0.0`
- `@progress/kendo-react-grid@^10.0.0`
- `@progress/kendo-theme-default@^10.3.1`

## Key Dependencies
- React 19
- TypeScript 5.7
- Vite 6.2
- KendoReact 10.x


## Development Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build

# Deploy to GitHub Pages
npm run deploy
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
| `outputFormat` | `structured \| query` | Output as JSON object or query string |
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
[Live CodeSandbox Demo](https://souravfrank.github.io/filterweave/)

## Development

```bash
npm run build
npm run lint
npm run test
```
