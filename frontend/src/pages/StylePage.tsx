import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, Recommendation, saveQuestionnaire } from '../services/recommendations';
import { useAuth } from '../state/AuthContext';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export function StylePage() {
  const { user } = useAuth();
  const [bodyType, setBodyType] = useState('');
  const [skinTone, setSkinTone] = useState('');
  const [heightRange, setHeightRange] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [consent, setConsent] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setLoadingRecs(true);
      getRecommendations()
        .then(setRecommendations)
        .catch(() => undefined)
        .finally(() => setLoadingRecs(false));
    }
  }, [user]);

  if (!user) {
    return (
      <section className="card narrow" style={{ textAlign: 'center' }}>
        <h1 className="serif-title">Asesoría de estilo</h1>
        <p className="subtitle">
          Ingresa a tu cuenta de CARPIDI para recibir recomendaciones personalizadas basadas en tu morfología, estatura y preferencias.
        </p>
        <Link className="button-stitch" to="/login">Ingresar</Link>
      </section>
    );
  }

  const toggleStyle = (value: string) => {
    setStyles(current =>
      current.includes(value) ? current.filter(item => item !== value) : [...current, value]
    );
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent) {
      setError('Debes autorizar el consentimiento para procesar tu asesoría de estilo.');
      return;
    }
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await saveQuestionnaire({
        bodyType,
        skinTone,
        heightRange,
        stylePreferences: styles,
        consent: true,
      });
      const updatedRecs = await getRecommendations();
      setRecommendations(updatedRecs);
      setMessage('¡Listo! Hemos actualizado tus recomendaciones según tu morfología y estilo personal.');
    } catch {
      setError('No fue posible guardar tus respuestas. Completa todos los campos e inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="card" style={{ maxWidth: '780px', margin: '0 auto 3rem' }}>
        <h1 className="serif-title">Asesoría de estilo</h1>
        <p className="subtitle">
          Cuéntanos sobre ti y encontraremos prendas que combinan contigo y respetan tus proporciones naturales.
        </p>

        {message && <div className="alert-success" role="status" style={{ marginBottom: '1.5rem' }}>{message}</div>}
        {error && <div className="alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form className="form-stitch" onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <label>
              Tipo de cuerpo
              <select required value={bodyType} onChange={e => setBodyType(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="Reloj de arena">Reloj de arena</option>
                <option value="Triángulo">Triángulo</option>
                <option value="Rectángulo">Rectángulo</option>
                <option value="Óvalo">Óvalo</option>
              </select>
            </label>

            <label>
              Tono de piel
              <select required value={skinTone} onChange={e => setSkinTone(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="Claro">Claro</option>
                <option value="Medio">Medio</option>
                <option value="Oscuro">Oscuro</option>
              </select>
            </label>

            <label>
              Estatura
              <select required value={heightRange} onChange={e => setHeightRange(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="Baja">Baja (menos de 1.60 m)</option>
                <option value="Media">Media (1.60 m - 1.70 m)</option>
                <option value="Alta">Alta (más de 1.70 m)</option>
              </select>
            </label>
          </div>

          <fieldset style={{ border: '1px solid #ECE6DE', borderRadius: '6px', padding: '1.25rem', margin: '0.5rem 0' }}>
            <legend style={{ padding: '0 0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#57534E' }}>
              Estilo preferido
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {['casual', 'elegante', 'deportivo', 'romántico'].map(style => (
                <label key={style} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={styles.includes(style)}
                    onChange={() => toggleStyle(style)}
                    style={{ width: 'auto' }}
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.82rem', textTransform: 'none', color: '#57534E', fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              style={{ width: 'auto' }}
              required
            />
            <span>Autorizo el tratamiento de mis datos de perfil de estilo para recibir recomendaciones personalizadas.</span>
          </label>

          <button
            className="button-stitch"
            type="submit"
            disabled={!styles.length || !bodyType || !skinTone || !heightRange || !consent || submitting}
            style={{ marginTop: '0.5rem' }}
          >
            {submitting ? 'Guardando preferencias…' : 'Guardar y recomendar'}
          </button>
        </form>
      </div>

      <div className="card">
        <p className="eyebrow">Curaduría Personalizada</p>
        <h2 className="serif-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Recomendaciones para ti</h2>

        {loadingRecs && <div className="loading-state" role="status">Analizando tus preferencias de silueta y color…</div>}

        {!loadingRecs && recommendations.length === 0 && (
          <div className="empty-state">
            <h3>Aún no tienes recomendaciones</h3>
            <p>Diligencia el cuestionario de estilo superior para que nuestro motor seleccione prendas afines a tu morfología.</p>
          </div>
        )}

        {!loadingRecs && recommendations.length > 0 && (
          <div className="products-grid">
            {recommendations.map(item => (
              <article key={item.productId} className="product-card-stitch">
                <div>
                  <div className="arched-frame" aria-hidden="true">
                    <span>CARPIDI MATCH</span>
                  </div>
                  <div className="product-meta">
                    <p className="eyebrow" style={{ color: '#059669' }}>{item.reason}</p>
                    <h3>{item.name}</h3>
                    <p className="product-price">{money.format(item.price)}</p>
                  </div>
                </div>
                <div className="product-actions">
                  <Link to={`/productos/${item.productId}`} className="button-stitch" style={{ width: '100%', textAlign: 'center', padding: '0.65rem' }}>
                    Ver prenda
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
