import downloadTranslations from './support/translations';
import gulp from 'gulp';

gulp.task('fetch-translations', (done) => downloadTranslations('97547', done));
