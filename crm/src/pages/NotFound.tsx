import { Link } from 'react-router-dom';

import { Empty } from '../components/ui';

export default function NotFound() {
  return (
    <Empty title="Esta página no existe">
      <Link to="/" className="btn sm" style={{ marginTop: 10 }}>
        Ir al resumen
      </Link>
    </Empty>
  );
}
