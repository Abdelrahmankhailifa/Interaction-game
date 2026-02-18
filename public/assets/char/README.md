# Character Assets

Place your layered character parts here.

## File Structure

For layered characters, split into parts:

- `tweety-head.png` - Character head
- `tweety-body.png` - Character body
- `tweety-arm-left.png` - Left arm
- `tweety-arm-right.png` - Right arm
- `tweety-eyes.png` - Eyes (for blinking animation)

## Recommended Specifications

- **Format**: PNG with transparency
- **Size**: Consistent sizing across parts
- **Background**: Transparent
- **Naming**: Use descriptive names (e.g., `character-part.png`)

## Usage

Reference in scene JSON:

```json
{
  "character": {
    "parts": {
      "head": {
        "image": "/assets/char/tweety-head.png",
        "offset": { "x": 0, "y": -80 },
        "zIndex": 3
      }
    }
  }
}
```

## Tips

- Export parts from the same source file to maintain consistency
- Use consistent canvas size for all parts
- Align parts properly using offset values
- Higher z-index = rendered on top

