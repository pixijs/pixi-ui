"use strict";

var gulp = require("gulp"),
  rimraf = require("rimraf"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify");

var paths = {
    src: "./src/",
    bin: "./bin/"
};

gulp.task("build", function () {
    return gulp.src([paths.src], { base: "." })
      .pipe(concat(paths.bin))
      .pipe(uglify())
      .pipe(gulp.dest("."));
});