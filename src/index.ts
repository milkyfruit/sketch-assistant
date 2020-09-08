import {
  AssistantPackage,
  RuleDefinition,
  FileFormat
} from '@sketch-hq/sketch-assistant-types'

const styleHasDisabledFill = (style: FileFormat.Style): boolean =>
  Array.isArray(style.fills) && style.fills.some((fill) => fill.isEnabled)

const wsrColors: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context


    for (const layer of utils.objects.anyLayer) {
      if (!('style' in layer)) continue // Narrow type to layers with a `style` prop
      if (!layer.style) continue // Narrow type to truthy `style` prop
      if (typeof layer.sharedStyleID === 'string') continue // Ignore layers using a shared style


      if (styleHasDisabledFill(layer.style)) {
        const red = layer.style.fills?.[0]?.color?.red
        const green = layer.style.fills?.[0]?.color?.green
        const blue = layer.style.fills?.[0]?.color?.blue

        if (!(red == 1 && green == 0 && blue == 0)) {
          utils.report(`Layer “${layer.name}” is NOT red`, layer)
        }
      }
    }
  },
  name: 'sketch-assistant-template/wsr-colors',
  title: 'This color is NOT red',
  description: 'asd',
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'sketch-assistant-template',
    rules: [wsrColors],
    config: {
      rules: {
        'sketch-assistant-template/wsr-colors': {
          active: true
        },
      },
    },
  }
}

export default assistant
