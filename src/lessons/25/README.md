## Exercise
Adding shadows

- Exercise: Spot Light in https://content.udacity-data.com/cs291/notes/UdacityLesson6Lights.pdf
- Initial setup in https://github.com/udacity/cs291/blob/master/unit6/14-shadows.js


Notes:
- The shadow camera on the spot light is important. The shadow will only appear if it is within the view field of the camera. To visualize the camera view field, one can use `new CameraHelper( spotLight.shadow.camera )`.
- To visualize the spot light, one can use: `new SpotLightHelper(spotLight)`.