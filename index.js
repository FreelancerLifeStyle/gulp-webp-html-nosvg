const Vinyl = require('vinyl')
const PluginError = Vinyl.PluginError
const through = require('through2')

const pluginName = 'gulp-webp-html-nosvg'

module.exports = function (optns = {}) {
	var extensions = ['.jpg', '.png', '.jpeg', '.GIF', '.gif', '.JPG', '.PNG', '.JPEG'];
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file)
			return
		}
		if (file.isStream()) {
			cb(new PluginError(pluginName, 'Streaming not supported'))
			return
		}
		try {
			var pictureRender = function (url, imgTag) {
				let srcset = imgTag.indexOf('data-src') >= 0 ? "data-srcset" : "srcset";
				return (`<picture><source ${srcset}="${url}" type="image/webp">${imgTag}</picture>`)
			}
			var inPicture = false
			const data = file.contents
				.toString()
				.split('\n')
				.map(function (line) {
					// Вне <picture/>?
					if (line.indexOf('<picture') + 1) inPicture = true
					if (line.indexOf('</picture') + 1) inPicture = false

					// Проверяем есть ли <img/>
					if (line.indexOf('<img') + 1 && !inPicture) {
						// Новый урл с .webp
						var Re = /<img([^>]*)src=\"(\S+)\"([^>]*)>/gi
						var regexpArray = Re.exec(line)
						var imgTag = regexpArray[0];
						var newUrl = regexpArray[2];
						// Если в урле есть .webp или .svg, пропускаем
						if (newUrl.indexOf('.webp') + 1 || newUrl.indexOf('.svg') + 1 || newUrl.indexOf('.gif') + 1) return line
						// Заменяем все расширения на .webp
						for (k in extensions) {
							newUrl = newUrl.replace(extensions[k], '.webp')
						}
						// Усли настройка dpr передана аргументом, то в разметку добавляется адрес с директивой
						if (optns.dpr) {
							newUrl = newUrl.replace('.webp', `.webp, ${newUrl.replace('.webp', `@${optns.dpr}.webp ${optns.dpr}`)}`)
						}
						// Компилим <picture/>
						var newHTML = pictureRender(newUrl, imgTag)
						return line.replace(imgTag, newHTML)
					}
					return line
				})
				.join('\n')
			file.contents = new Buffer.from(data)
			this.push(file)
		} catch (err) {
			console.log('!!! Убедитесь, что в названии файла картинки нет проблелов и/или кириллицы');
			this.emit('error', new PluginError(pluginName, err))
		}
		cb()
	})
}