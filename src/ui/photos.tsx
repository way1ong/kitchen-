import { useRef, useState } from 'react';
import { PHOTOS, photoUrl } from '../data/photos';
import { T } from '../i18n/strings';
import { deleteOwnPhoto, preparePhoto, saveOwnPhoto, useOwnPhoto, useOwnPhotoIds } from '../state/photos';
import { ConfirmButton } from './components';
import { Icon } from './icons';

/** Адреса фото страви: ваше (якщо є) або приклад; undefined — ваше ще завантажується. */
function usePhotoSrc(id: string): { src: string | null | undefined; own: boolean } {
  const own = useOwnPhotoIds().has(id);
  const ownUrl = useOwnPhoto(id, own);
  const ex = PHOTOS[id];
  if (own) return { src: ownUrl ?? undefined, own };
  return { src: ex ? photoUrl(ex) : null, own };
}

/**
 * Фото на сторінці рецепта: ваше або приклад з Wikimedia Commons
 * (з підписом автора й ліцензії) і кнопки «Додати / Замінити / Прибрати своє фото».
 */
export function DishPhotoBlock({ id, name }: { id: string; name: string }) {
  const { src, own } = usePhotoSrc(id);
  const ex = PHOTOS[id];
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const L = T().photo;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(false);
    try {
      await saveOwnPhoto(id, await preparePhoto(file));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <figure className="dish-photo">
      {src ? (
        <img
          className="dish-photo-img"
          src={src}
          alt={own ? L.ownAlt(name) : L.exampleAlt(name)}
          width={800}
          height={533}
          decoding="async"
        />
      ) : src === undefined ? (
        <div className="dish-photo-img" aria-hidden="true" />
      ) : (
        <div className="dish-photo-none">
          <Icon name="camera" size={28} />
          <span>{L.none}</span>
        </div>
      )}
      {own ? (
        <figcaption className="dish-photo-cap">
          <span className="tag">
            <Icon name="user" size={16} /> {L.yours}
          </span>{' '}
          {L.localNote}
        </figcaption>
      ) : ex ? (
        <figcaption className="dish-photo-cap">
          {L.example}{' '}
          <span className="credit">
            {L.credit}{' '}
            <a href={ex.page} target="_blank" rel="noopener noreferrer">
              {ex.author}
            </a>
            ,{' '}
            {ex.licenseUrl ? (
              <a href={ex.licenseUrl} target="_blank" rel="noopener noreferrer">
                {ex.license}
              </a>
            ) : (
              ex.license
            )}
            , Wikimedia Commons, {L.cropped}
          </span>
        </figcaption>
      ) : null}
      <div className="photo-actions">
        <button type="button" className="btn btn-sm" onClick={() => input.current?.click()} disabled={busy}>
          <Icon name="camera" size={18} /> {busy ? L.saving : own ? L.replace : L.add}
        </button>
        {own ? (
          <ConfirmButton className="btn btn-ghost btn-sm" icon="trash" confirmText={L.removeConfirm} onConfirm={() => void deleteOwnPhoto(id)}>
            {L.remove}
          </ConfirmButton>
        ) : null}
        <input
          ref={input}
          id={`photo-${id}`}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p className="field-error" role="alert">
          <Icon name="alert" size={16} /> {L.error}
        </p>
      ) : null}
    </figure>
  );
}

/** Маленьке фото страви для списків (ваше або приклад); без фото — нічого. */
export function DishThumb({ id, size = 72 }: { id: string; size?: number }) {
  const { src } = usePhotoSrc(id);
  if (src === null) return null;
  const style = { width: size, height: size };
  if (src === undefined) return <span className="thumb" style={style} aria-hidden="true" />;
  return <img className="thumb" src={src} alt="" width={size} height={size} loading="lazy" decoding="async" style={style} />;
}
