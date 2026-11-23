import { useState } from "react";

export default function SafeImg({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`tb-img-fallback ${className}`} role="img" aria-label={alt}>
        {alt}
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  );
}