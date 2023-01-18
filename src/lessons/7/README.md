## Exercise
Try Lambert material for a sphere. 

Based on:
- Diffuse material exercise in unit 3 in https://content.udacity-data.com/cs291/notes/UdacityLesson3ColorsandMaterials.pdf
- Initial setup in https://github.com/udacity/cs291/blob/master/unit3/diffuse-material.js

### Note:
Instruction materials assume that Three's Lambert material has an `ambient` property on it, which can set its RGB color. However, this is no longer true for modern versions of Three. Accrording to an [answer](https://stackoverflow.com/questions/39505277/uncaught-typeerror-cannot-read-property-setrgb-of-undefined) on StackOverflow:

> The ambient reflectance of the material (how the material responds to indirect, or ambient, light) is now assumed to be the same as the diffuse reflectance of the material (how the material responds to direct light).

> The diffuse reflectance of the material is also known as the material's color.