## Exercise
Create an RGB triangle with vertex colors. 

Based on:
- Vertex Attributes exercise in unit 3 in https://content.udacity-data.com/cs291/notes/UdacityLesson3ColorsandMaterials.pdf
- Initial setup in https://github.com/udacity/cs291/blob/master/unit3/vertex-attributes.js — required update to BufferGeometry and BufferAttributes for color.

Importantly, when the color attribute was created from the BufferAttribute (`new BufferAttribute( colors, 3, true)`), normalization had to be used to make sure that colors do not go out of the GLSL range.
