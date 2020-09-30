import helmet from 'helmet';
import compression from 'compression';

export function application(app) {
    app.use(helmet());
    app.use(compression());
}
