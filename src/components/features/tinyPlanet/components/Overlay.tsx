import styles from './TinyPlanet.module.css';

type Props = {
  hintVisible: boolean;
  title?: string;
  subtitle?: string;
  credit?: string;
};

export function Overlay({ hintVisible, title, subtitle, credit }: Props) {
  return (
    <>
      {(title || subtitle) && (
        <div className={styles.title}>
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      {credit && <div className={styles.credit}>{credit}</div>}

      {/* Device-neutral wording: this renders on touch as well, where WASD means nothing. */}
      <div className={styles.hint} style={{ opacity: hintVisible ? 1 : 0 }}>
        drag to look around · d-pad or WASD to walk
      </div>
    </>
  );
}
