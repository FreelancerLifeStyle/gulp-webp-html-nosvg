# gulp-webp-in-html

This is a modified version of the plugin [gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html). Here was fixed thebug that added two dots before webp to the final html file. No SVG format.

## Example
```html
// Input
<img src="/images/catalogImage.jpg">

// Output
<picture>
    <source srcset="/images/catalogImage.webp" type="image/webp">
    <img src="/images/catalogImage.jpg">
</picture>
```
## Install
```bash
npm i --save-dev gulp-webp-html-nosvg
```
## Usage
```javascript
var GulpWebpHtml2 = require('gulp-webp-html-nosvg');

gulp.task('html',function(){
    gulp.src('./assets/**/*.html')
        .pipe(GulpWebpHtml2())
        .pipe(gulp.dest('./public/'))
});
```
