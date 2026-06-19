/**
 * Star rating widget.
 * - readOnly: just displays `value` stars.
 * - interactive: calls onChange(n) when a star is clicked.
 */
export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  const rounded = Math.round(value);

  return (
    <span className={`stars ${readOnly ? 'stars-readonly' : 'stars-interactive'}`}>
      {stars.map((n) => (
        <span
          key={n}
          className={`star ${n <= rounded ? 'star-filled' : 'star-empty'}`}
          role={readOnly ? undefined : 'button'}
          tabIndex={readOnly ? undefined : 0}
          onClick={readOnly ? undefined : () => onChange && onChange(n)}
          onKeyDown={
            readOnly
              ? undefined
              : (e) => {
                  if (e.key === 'Enter' || e.key === ' ') onChange && onChange(n);
                }
          }
          title={readOnly ? `${value}` : `Rate ${n}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}
