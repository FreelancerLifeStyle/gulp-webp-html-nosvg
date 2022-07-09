# gulp-webp-html-nosvg

This is a modified version of the plugin [gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html).

The following was fixed:
- the bug that added two dots before webp to the final html file
- files in SVG format are now excluded

Keep in mind that all `img` tags that are already inside a `picture` tag are also excluded. You can wrap in a `picture` tag all `img` tags that you want to keep as they already are, and thus do not want gulp-webp-html-nosvg to process.

## Examples

### `img` tags that are processed

```html
// Input
<img src="/images/catalogImage.jpg">

// Output
<picture>
    <source srcset="/images/catalogImage.webp" type="image/webp">
    <img src="/images/catalogImage.jpg">
</picture>
```

```html
// Input
<img src="/images/catalogImage.jpg" srcset="/images/catalogImage2x.jpg 2x">

// Output
<picture>
    <source srcset="/images/catalogImage.webp, /images/catalogImage2x.webp 2x" type="image/webp">
    <img src="/images/catalogImage.jpg" srcset="/images/catalogImage2x.jpg 2x">
</picture>
```

### `img` tags that are excluded

```html
// Input
<img src="/images/catalogImage.svg">

// Output
<img src="/images/catalogImage.svg">
```

```html
// Input
<picture>
    <img src="/images/catalogImage.jpg">
</picture>

// Output
<picture>
    <img src="/images/catalogImage.jpg">
</picture>
```

## Install
```bash
npm i --save-dev gulp-webp-html-nosvg
```
## Usage
```javascript
let webphtml = require('gulp-webp-html-nosvg');

gulp.task('html',function(){
    gulp.src('./assets/**/*.html')
        .pipe(webphtml())
        .pipe(gulp.dest('./public/'))
});
```
