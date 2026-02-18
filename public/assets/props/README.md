# Foreground Props

Place your foreground props and objects here for depth and atmosphere.

## Examples

- `tree-left.png` - Left side tree
- `tree-right.png` - Right side tree
- `cloud-1.png` - Floating cloud
- `flower-bush.png` - Decorative flowers
- `rock.png` - Ground elements

## Recommended Specifications

- **Format**: PNG with transparency
- **Size**: Varies based on prop
- **Background**: Transparent
- **Optimization**: Use appropriate sizes (don't over-scale)

## Usage

Reference in scene JSON:

```json
{
  "foregroundProps": [
    {
      "image": "/assets/props/tree-left.png",
      "position": {
        "left": "10%",
        "bottom": "0%",
        "width": "200px",
        "height": "300px"
      },
      "parallaxSpeed": 0.6
    }
  ]
}
```

## Tips

- Use props to create depth and atmosphere
- Position props strategically (sides, foreground)
- Adjust parallax speed for depth effect
- Animate props for dynamic scenes

