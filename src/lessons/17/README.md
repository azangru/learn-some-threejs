## Exercise
Matrix transformations

Based on:
- Exercise: Make an Ornament/Caltrop in https://content.udacity-data.com/cs291/notes/UdacityLesson5Matrices.pdf
- Initial setup in https://github.com/udacity/cs291/blob/d363a1792b66e3e3682240fd013d6617d8125a0a/unit5/unit5-axis_angle_exercise.js



There was an interesting discussion about rotating a Three.js object around an arbitrary point on Stack Overflow. I should really explore this approach:

https://stackoverflow.com/a/42866733/3925302

```js
// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
```